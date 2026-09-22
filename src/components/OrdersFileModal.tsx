import React, { useState, useEffect } from 'react';
import { CsvOrderItem } from '../types';

interface OrdersFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastUpdated?: number;
}

interface GoogleSheetConfigState {
  webhookUrl: string;
  sheetUrl: string;
  autoSync: boolean;
  lastSyncTime?: string;
  lastSyncStatus?: 'success' | 'error' | 'none';
  lastSyncMessage?: string;
  configured?: boolean;
}

const APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Tự động tạo dòng tiêu đề chuẩn nếu trang tính chưa có dữ liệu
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "STT",
        "Họ tên",
        "Số điện thoại",
        "Địa chỉ giao hàng",
        "Sản phẩm mua",
        "Ngày đặt hàng",
        "Số tiền thanh toán",
        "Ghi chú",
        "Thời gian ghi nhận"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#dbeafe");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    var nextStt = sheet.getLastRow();
    var sttVal = data.stt || nextStt;
    var phoneStr = "'" + String(data.phone || "");

    sheet.appendRow([
      sttVal,
      data.fullName || "",
      phoneStr,
      data.address || "",
      data.productName || "",
      data.orderDate || "",
      data.amount || 0,
      data.note || "",
      new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã thêm đơn hàng vào Google Sheet thành công"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const OrdersFileModal: React.FC<OrdersFileModalProps> = ({
  isOpen,
  onClose,
  lastUpdated = 0,
}) => {
  const [orders, setOrders] = useState<CsvOrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [rawCsv, setRawCsv] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'google-sheet' | 'raw'>('table');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [copyScriptSuccess, setCopyScriptSuccess] = useState<boolean>(false);

  // Google Sheet Configuration State
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfigState>({
    webhookUrl: '',
    sheetUrl: '',
    autoSync: true,
  });
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [isTestingSheet, setIsTestingSheet] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [configMessage, setConfigMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
          setTotalAmount(data.total || 0);
          setRawCsv(data.rawCsv || '');
          setIsLoading(false);
          return;
        }
      }
      throw new Error('API not available');
    } catch (err) {
      // Fallback
      const savedOrdersStr = localStorage.getItem('hunonic_orders_csv_records');
      if (savedOrdersStr) {
        try {
          const parsed = JSON.parse(savedOrdersStr);
          setOrders(parsed);
          setTotalAmount(parsed.reduce((sum: number, o: CsvOrderItem) => sum + (o.amount || 0), 0));
        } catch {
          // ignore
        }
      } else {
        const defaultOrders: CsvOrderItem[] = [
          {
            stt: 1,
            fullName: 'Vương Văn Lực',
            phone: '966757585',
            address: '253, Nguyễn Thị Duệ, phường Việt Hòa, tp Hải Phòng',
            productName: 'Bộ Điều Khiển Hồng Ngoại IR',
            orderDate: '16/09/2026',
            amount: 295000,
            note: 'test',
          },
        ];
        setOrders(defaultOrders);
        setTotalAmount(295000);
      }
      setIsLoading(false);
    }
  };

  const fetchSheetConfig = async () => {
    try {
      const res = await fetch('/api/google-sheet/config');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          setSheetConfig(data.config);
        }
      }
    } catch (err) {
      console.warn('Could not fetch google sheet config:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
      fetchSheetConfig();
    }
  }, [isOpen, lastUpdated]);

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    setConfigMessage(null);
    try {
      const res = await fetch('/api/google-sheet/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: sheetConfig.webhookUrl,
          sheetUrl: sheetConfig.sheetUrl,
          autoSync: sheetConfig.autoSync,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSheetConfig(data.config);
        setConfigMessage({ type: 'success', text: 'Đã lưu cấu hình Google Sheet thành công!' });
      } else {
        setConfigMessage({ type: 'error', text: data.message || 'Lỗi khi lưu cấu hình' });
      }
    } catch (err: any) {
      setConfigMessage({ type: 'error', text: err?.message || 'Lỗi kết nối máy chủ' });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleTestConnection = async () => {
    if (!sheetConfig.webhookUrl) {
      setConfigMessage({ type: 'error', text: 'Vui lòng dán Webhook URL trước khi thử nghiệm' });
      return;
    }
    setIsTestingSheet(true);
    setConfigMessage(null);
    try {
      const res = await fetch('/api/google-sheet/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: sheetConfig.webhookUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setConfigMessage({ type: 'success', text: data.message });
        fetchSheetConfig();
      } else {
        setConfigMessage({ type: 'error', text: data.message || 'Kiểm tra kết nối thất bại' });
      }
    } catch (err: any) {
      setConfigMessage({ type: 'error', text: err?.message || 'Lỗi khi kiểm tra kết nối' });
    } finally {
      setIsTestingSheet(false);
    }
  };

  const handleSyncAllOrders = async () => {
    if (!sheetConfig.webhookUrl) {
      setConfigMessage({ type: 'error', text: 'Vui lòng cấu hình Webhook URL trước' });
      return;
    }
    setIsSyncingAll(true);
    setConfigMessage(null);
    try {
      const res = await fetch('/api/google-sheet/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setConfigMessage({ type: 'success', text: data.message });
        fetchSheetConfig();
      } else {
        setConfigMessage({ type: 'error', text: data.message || 'Lỗi đồng bộ' });
      }
    } catch (err: any) {
      setConfigMessage({ type: 'error', text: err?.message || 'Lỗi khi đồng bộ hàng loạt' });
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleDownloadCsv = () => {
    window.open('/api/orders/download', '_blank');
  };

  const handleCopyRawCsv = () => {
    let contentToCopy = rawCsv;
    if (!contentToCopy) {
      contentToCopy = 'STT,Họ tên,SĐT,Địa chỉ,Sản phẩm mua,Ngày tháng năm,Số tiền thanh toán,Ghi chú\n';
      for (const o of orders) {
        const addr = o.address.includes(',') ? `"${o.address}"` : o.address;
        contentToCopy += `${o.stt},${o.fullName},${o.phone},${addr},${o.productName},${o.orderDate},${o.amount},${o.note}\n`;
      }
      contentToCopy += `,Tổng,,,,,,${totalAmount},\n`.replace(',,,,,,', ',,,,,');
    }
    navigator.clipboard.writeText(contentToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopyScriptSuccess(true);
    setTimeout(() => setCopyScriptSuccess(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">dataset</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                  Dữ Liệu Đơn Hàng & Đồng Bộ Google Sheet
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                  Điện 365 Hunonic
                </span>
                {sheetConfig.configured ? (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Google Sheet Đã Kết Nối
                  </span>
                ) : (
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                    <span className="material-symbols-outlined text-[12px]">sync_problem</span>
                    Chưa cài Webhook Sheet
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mọi đơn hàng từ khách hàng đều được lưu vào file <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">orders.csv</code> và tự động đẩy sang Google Sheet theo thời gian thực.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Toolbar with Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Danh Sách Đơn Hàng ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('google-sheet')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'google-sheet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              <span>Cấu Hình & Đồng Bộ Google Sheet</span>
              {sheetConfig.configured && (
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span className="hidden sm:inline">Xem File Thô CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'table' && (
              <>
                <button
                  onClick={fetchOrders}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  title="Làm mới danh sách từ máy chủ"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span className="hidden sm:inline">Làm mới</span>
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Tải file .CSV</span>
                </button>
              </>
            )}

            {sheetConfig.sheetUrl && (
              <a
                href={sheetConfig.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Mở Google Sheet</span>
              </a>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: ORDERS TABLE */}
          {activeTab === 'table' && (
            <>
              {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Đang đọc file đơn hàng orders.csv...</span>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 border-collapse">
                      <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3 w-12 text-center">STT</th>
                          <th className="py-3 px-3">Họ tên khách</th>
                          <th className="py-3 px-3">Số điện thoại</th>
                          <th className="py-3 px-3 min-w-[200px]">Địa chỉ nhận hàng</th>
                          <th className="py-3 px-3 min-w-[180px]">Sản phẩm đặt mua</th>
                          <th className="py-3 px-3 whitespace-nowrap">Ngày đặt</th>
                          <th className="py-3 px-3 text-right">Tổng thanh toán</th>
                          <th className="py-3 px-3">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                          <tr key={order.stt} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 text-center font-bold text-slate-500">{order.stt}</td>
                            <td className="py-3 px-3 font-semibold text-slate-900">{order.fullName}</td>
                            <td className="py-3 px-3 font-mono text-blue-700 font-bold">
                              <a href={`tel:${order.phone}`} className="hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px] text-emerald-600">call</span>
                                {order.phone}
                              </a>
                            </td>
                            <td className="py-3 px-3 text-slate-600" title={order.address}>
                              {order.address}
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-800">{order.productName}</td>
                            <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-medium">{order.orderDate}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-[#e04b16]">
                              {order.amount.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="py-3 px-3 text-slate-500 italic" title={order.note}>
                              {order.note || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-amber-50/90 border-t-2 border-amber-200 text-slate-900 font-bold">
                        <tr>
                          <td colSpan={2} className="py-3.5 px-3 uppercase text-amber-900 font-extrabold">
                            Tổng cộng ({orders.length} đơn hàng)
                          </td>
                          <td colSpan={4} className="py-3.5 px-3 text-slate-500 text-right">
                            Doanh số dự kiến:
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-base font-black text-[#e04b16]">
                            {totalAmount.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3.5 px-3"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: GOOGLE SHEET CONFIGURATION & SYNC */}
          {activeTab === 'google-sheet' && (
            <div className="flex flex-col gap-6">
              {/* Status Alert Box */}
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  sheetConfig.configured
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      sheetConfig.configured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {sheetConfig.configured ? 'cloud_done' : 'cloud_sync'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">
                      {sheetConfig.configured
                        ? 'Hệ Thống Đã Được Kết Nối Với Google Sheet'
                        : 'Chưa Cấu Hình Webhook Tự Động Cho Google Sheet'}
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90">
                      {sheetConfig.configured
                        ? 'Mỗi khi khách hàng bấm Đặt Hàng trên website, thông tin sẽ được đẩy ngay lập tức vào Trang tính Google Sheet của bạn.'
                        : 'Để đơn hàng tự động cập nhật vào Google Sheet, vui lòng làm theo hướng dẫn 3 bước đơn giản bên dưới để lấy Webhook URL.'}
                    </p>
                    {sheetConfig.lastSyncTime && (
                      <p className="text-[11px] mt-1 font-medium text-slate-600">
                        Lần đồng bộ gần nhất: <strong>{sheetConfig.lastSyncTime}</strong> — {sheetConfig.lastSyncMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleSyncAllOrders}
                    disabled={isSyncingAll || !sheetConfig.webhookUrl}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSyncingAll ? 'sync' : 'upload_file'}
                    </span>
                    <span>{isSyncingAll ? 'Đang đồng bộ...' : 'Đồng bộ toàn bộ đơn sang Sheet'}</span>
                  </button>
                </div>
              </div>

              {/* Message Banner */}
              {configMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    configMessage.type === 'success'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {configMessage.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{configMessage.text}</span>
                </div>
              )}

              {/* Webhook & URL Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">link</span>
                  Cài Đặt Đường Dẫn Webhook & Link Xem Google Sheet
                </h4>

                <form onSubmit={handleSaveConfig} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Google Apps Script Web App Webhook URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={sheetConfig.webhookUrl}
                        onChange={(e) => setSheetConfig({ ...sheetConfig, webhookUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      URL Web App kết thúc bằng <code className="font-mono bg-slate-100 px-1 py-0.2 rounded">/exec</code> sau khi bạn ấn "Triển khai mới" trong Google Apps Script.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Link Xem Trang Tính Google Sheet (Tùy chọn)
                    </label>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                      value={sheetConfig.sheetUrl}
                      onChange={(e) => setSheetConfig({ ...sheetConfig, sheetUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Dán link Google Sheet của bạn để có thể bấm nút "Mở Google Sheet" nhanh chóng mọi lúc.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="autoSync"
                      checked={sheetConfig.autoSync}
                      onChange={(e) => setSheetConfig({ ...sheetConfig, autoSync: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="autoSync" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Tự động đồng bộ ngay lập tức mỗi khi khách hoàn tất gửi form đặt hàng
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSavingConfig}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{isSavingConfig ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTestingSheet || !sheetConfig.webhookUrl}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isTestingSheet ? 'hourglass_top' : 'send'}
                      </span>
                      <span>{isTestingSheet ? 'Đang gửi test...' : 'Gửi Thử 1 Đơn Kiểm Tra'}</span>
                    </button>

                    {sheetConfig.sheetUrl && (
                      <a
                        href={sheetConfig.sheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        <span>Mở Google Sheet Của Bạn</span>
                      </a>
                    )}
                  </div>
                </form>
              </div>

              {/* Step-by-Step Instructions & Script Copy */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">help_center</span>
                    Hướng Dẫn Kết Nối Google Sheet Trong 3 Bước (Chỉ Mất 1 Phút)
                  </h4>

                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copyScriptSuccess ? 'check' : 'content_copy'}
                    </span>
                    <span>{copyScriptSuccess ? 'Đã copy mã code!' : 'Sao Chép Mã Apps Script'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <strong className="text-slate-900 font-semibold">Tạo Trang Tính & Mở Apps Script</strong>
                    <p>
                      Mở Google Sheet mới của bạn (hoặc sheet hiện có) &rarr; chọn menu <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; bấm <strong>Apps Script</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <strong className="text-slate-900 font-semibold">Dán Mã Code & Triển Khai</strong>
                    <p>
                      Xóa hết mã cũ trong file <code className="font-mono bg-slate-200 px-1 py-0.2 rounded">Code.gs</code>, dán đoạn mã bên dưới vào &rarr; bấm <strong>Lưu (Ctrl+S)</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <strong className="text-slate-900 font-semibold">Xuất Bản & Dán Link Webhook</strong>
                    <p>
                      Bấm nút <strong>Triển khai (Deploy)</strong> &rarr; <strong>Tùy chọn triển khai mới</strong> &rarr; Chọn loại: <strong>Ứng dụng web (Web app)</strong> &rarr; Ai có quyền truy cập: chọn <strong>Bất kỳ ai (Anyone)</strong> &rarr; Copy link URL và dán vào ô bên trên!
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">Mã Google Apps Script tự động tạo bảng & ghi đơn:</span>
                    <button
                      onClick={handleCopyScript}
                      className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      {copyScriptSuccess ? 'Đã sao chép!' : 'Copy code'}
                    </button>
                  </div>
                  <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                    <pre>{APPS_SCRIPT_TEMPLATE}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW CSV */}
          {activeTab === 'raw' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Nội dung chuẩn tệp <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-800">orders.csv</code> trên server:
                </span>
                <button
                  onClick={handleCopyRawCsv}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copySuccess ? 'check' : 'content_copy'}
                  </span>
                  <span>{copySuccess ? 'Đã sao chép!' : 'Copy CSV'}</span>
                </button>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                <pre>{rawCsv || 'Đang nạp file orders.csv...'}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Dữ liệu đồng bộ 2 chiều: Lưu trữ bền vững tại file CSV máy chủ & Google Spreadsheet đám mây.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

