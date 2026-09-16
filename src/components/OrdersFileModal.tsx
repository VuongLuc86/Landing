import React, { useState, useEffect } from 'react';
import { CsvOrderItem } from '../types';

interface OrdersFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastUpdated?: number;
}

export const OrdersFileModal: React.FC<OrdersFileModalProps> = ({
  isOpen,
  onClose,
  lastUpdated = 0,
}) => {
  const [orders, setOrders] = useState<CsvOrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [rawCsv, setRawCsv] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'raw'>('table');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

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
      // Fallback: check localStorage or show initial user template
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

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, lastUpdated]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                File Dữ Liệu Đơn Hàng — Điện 365 Đại Lý Chính Thức HUNONIC
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  orders.csv
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hotline hỗ trợ & đối soát đơn hàng: <strong className="text-blue-700 font-bold">0877.999.663</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 sm:px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Bảng danh sách ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'raw'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span>Nội dung file thô CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
              title="Làm mới dữ liệu từ file"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            <button
              onClick={handleCopyRawCsv}
              className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copySuccess ? 'check' : 'content_copy'}
              </span>
              <span>{copySuccess ? 'Đã sao chép!' : 'Copy CSV'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Tải file .CSV</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 sm:p-6 bg-slate-50/50">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Đang đọc file đơn hàng orders.csv...</span>
            </div>
          ) : activeTab === 'table' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">STT</th>
                      <th className="py-3 px-3">Họ tên</th>
                      <th className="py-3 px-3">SĐT</th>
                      <th className="py-3 px-3 min-w-[180px]">Địa chỉ</th>
                      <th className="py-3 px-3">Sản phẩm mua</th>
                      <th className="py-3 px-3 whitespace-nowrap">Ngày tháng năm</th>
                      <th className="py-3 px-3 text-right">Số tiền thanh toán</th>
                      <th className="py-3 px-3">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.stt} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">{order.stt}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{order.fullName}</td>
                        <td className="py-3 px-3 font-mono text-blue-700 font-medium">{order.phone}</td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={order.address}>
                          {order.address}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">{order.productName}</td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-500">{order.orderDate}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#e04b16]">
                          {order.amount.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="py-3 px-3 text-slate-500 italic max-w-[140px] truncate" title={order.note}>
                          {order.note || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-amber-50/80 border-t-2 border-amber-200 text-slate-900 font-bold">
                    <tr>
                      <td colSpan={2} className="py-3.5 px-3 uppercase text-amber-900">
                        Tổng cộng ({orders.length} đơn)
                      </td>
                      <td colSpan={4} className="py-3.5 px-3 text-slate-500 text-right">
                        Tổng thanh toán dự kiến:
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
          ) : (
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
              <pre>{rawCsv || 'Đang nạp file orders.csv...'}</pre>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 led-indicator" />
            <span>Định dạng chuẩn: STT, Họ tên, SĐT, Địa chỉ, Sản phẩm mua, Ngày tháng năm, Số tiền thanh toán, Ghi chú</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
