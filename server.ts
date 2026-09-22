import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const CSV_FILE_PATH = path.join(process.cwd(), 'orders.csv');
const GOOGLE_SHEET_CONFIG_PATH = path.join(process.cwd(), 'google_sheet_config.json');

interface GoogleSheetConfig {
  webhookUrl: string;
  sheetUrl: string;
  autoSync: boolean;
  lastSyncTime?: string;
  lastSyncStatus?: 'success' | 'error' | 'none';
  lastSyncMessage?: string;
}

function getGoogleSheetConfig(): GoogleSheetConfig {
  try {
    if (fs.existsSync(GOOGLE_SHEET_CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(GOOGLE_SHEET_CONFIG_PATH, 'utf-8'));
      return {
        webhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || data.webhookUrl || '',
        sheetUrl: process.env.GOOGLE_SHEET_URL || data.sheetUrl || '',
        autoSync: data.autoSync ?? true,
        lastSyncTime: data.lastSyncTime || undefined,
        lastSyncStatus: data.lastSyncStatus || 'none',
        lastSyncMessage: data.lastSyncMessage || '',
      };
    }
  } catch (e) {
    console.error('Error reading google sheet config:', e);
  }
  return {
    webhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || '',
    sheetUrl: process.env.GOOGLE_SHEET_URL || '',
    autoSync: true,
    lastSyncStatus: 'none',
  };
}

function saveGoogleSheetConfig(newConfig: Partial<GoogleSheetConfig>): GoogleSheetConfig {
  const current = getGoogleSheetConfig();
  const updated: GoogleSheetConfig = { ...current, ...newConfig };
  fs.writeFileSync(GOOGLE_SHEET_CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Helper to escape CSV field
function escapeCsvField(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Ensure CSV file exists with header and initial row
function ensureCsvFile() {
  if (!fs.existsSync(CSV_FILE_PATH)) {
    const initialContent =
      'STT,Họ tên,SĐT,Địa chỉ,Sản phẩm mua,Ngày tháng năm,Số tiền thanh toán,Ghi chú\n' +
      '1,Vương Văn Lực,966757585,"253, Nguyễn Thị Duệ, phường Việt Hòa, tp Hải Phòng",Bộ Điều Khiển Hồng Ngoại IR,16/09/2026,295000,test\n' +
      ',Tổng,,,,,295000,\n';
    fs.writeFileSync(CSV_FILE_PATH, initialContent, 'utf-8');
  }
}

// Parse existing CSV rows
interface OrderItem {
  stt: number;
  fullName: string;
  phone: string;
  address: string;
  productName: string;
  orderDate: string;
  amount: number;
  note: string;
}

function parseCsvOrders(): { orders: OrderItem[]; total: number } {
  ensureCsvFile();
  const content = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);

  const orders: OrderItem[] = [];
  let total = 0;

  // Simple CSV line parser respecting quotes
  const parseCsvLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const sttStr = (cols[0] || '').trim();
    if (!sttStr || sttStr.toLowerCase().includes('tổng')) {
      // Could be total row
      continue;
    }

    const stt = parseInt(sttStr, 10);
    if (isNaN(stt)) continue;

    const amount = parseInt((cols[6] || '0').replace(/[^0-9]/g, ''), 10) || 0;
    total += amount;

    orders.push({
      stt,
      fullName: (cols[1] || '').trim(),
      phone: (cols[2] || '').trim(),
      address: (cols[3] || '').trim(),
      productName: (cols[4] || '').trim(),
      orderDate: (cols[5] || '').trim(),
      amount,
      note: (cols[7] || '').trim(),
    });
  }

  return { orders, total };
}

async function sendOrderToGoogleSheet(order: OrderItem, config?: GoogleSheetConfig): Promise<{ success: boolean; message: string }> {
  const cfg = config || getGoogleSheetConfig();
  const webhook = (cfg.webhookUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL || '').trim();

  if (!webhook) {
    return { success: false, message: 'Chưa cấu hình URL Webhook Google Sheet' };
  }

  try {
    const payload = {
      stt: order.stt,
      fullName: order.fullName,
      phone: order.phone,
      address: order.address,
      productName: order.productName,
      orderDate: order.orderDate,
      amount: order.amount,
      note: order.note || '',
      source: 'Website Dien365 Hunonic D2C',
      createdAt: new Date().toISOString(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const responseText = await res.text().catch(() => '');

    // Check for Google Apps Script specific error pages (which return HTTP 200 with HTML)
    if (responseText.includes('Script function not found: doPost') || responseText.includes('Script function not found: doGet')) {
      const errMsg = 'Google Apps Script báo lỗi: "Script function not found: doPost". NGUYÊN NHÂN: Trong trang Apps Script, bạn chưa tạo Bản Triển Khai Mới sau khi dán mã. Vui lòng bấm: Triển khai -> Quản lý bản triển khai -> Sửa -> Chọn "Phiên bản mới" -> Triển khai.';
      saveGoogleSheetConfig({
        lastSyncTime: new Date().toLocaleString('vi-VN'),
        lastSyncStatus: 'error',
        lastSyncMessage: errMsg,
      });
      return { success: false, message: errMsg };
    }

    if (responseText.includes('<title>Error</title>') || responseText.includes('Script function not found') || responseText.includes('Google Docs encountered an error')) {
      const errMsg = `Google Apps Script gặp lỗi khi xử lý: ${responseText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180)}`;
      saveGoogleSheetConfig({
        lastSyncTime: new Date().toLocaleString('vi-VN'),
        lastSyncStatus: 'error',
        lastSyncMessage: errMsg,
      });
      return { success: false, message: errMsg };
    }

    // Try parsing JSON response from our standard doPost function
    let isSuccess = false;
    let successMessage = `Đã đồng bộ đơn hàng #${order.stt} (${order.fullName}) thành công`;
    try {
      const json = JSON.parse(responseText);
      if (json.status === 'success' || json.result === 'success') {
        isSuccess = true;
        if (json.message) successMessage = json.message;
      } else if (json.status === 'error') {
        const errMsg = `Google Apps Script báo lỗi: ${json.message || 'Lỗi không xác định'}`;
        saveGoogleSheetConfig({
          lastSyncTime: new Date().toLocaleString('vi-VN'),
          lastSyncStatus: 'error',
          lastSyncMessage: errMsg,
        });
        return { success: false, message: errMsg };
      }
    } catch {
      // If response is not JSON, check if HTTP is OK and response does not contain error keywords
      if (res.ok && !responseText.toLowerCase().includes('error')) {
        isSuccess = true;
      }
    }

    if (isSuccess) {
      saveGoogleSheetConfig({
        lastSyncTime: new Date().toLocaleString('vi-VN'),
        lastSyncStatus: 'success',
        lastSyncMessage: successMessage,
      });
      return { success: true, message: successMessage };
    } else {
      const errMsg = `Phản hồi không hợp lệ từ Google Sheet (HTTP ${res.status}): ${responseText.slice(0, 150)}`;
      saveGoogleSheetConfig({
        lastSyncTime: new Date().toLocaleString('vi-VN'),
        lastSyncStatus: 'error',
        lastSyncMessage: errMsg,
      });
      return { success: false, message: errMsg };
    }
  } catch (err: any) {
    const errMsg = err?.name === 'AbortError' ? 'Hết thời gian chờ kết nối Google Sheet (Timeout 12s)' : (err?.message || 'Lỗi mạng khi kết nối Google Sheet');
    saveGoogleSheetConfig({
      lastSyncTime: new Date().toLocaleString('vi-VN'),
      lastSyncStatus: 'error',
      lastSyncMessage: errMsg,
    });
    return { success: false, message: errMsg };
  }
}

// API Routes
app.get('/api/orders', (req, res) => {
  try {
    ensureCsvFile();
    const { orders, total } = parseCsvOrders();
    const rawCsv = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    res.json({ success: true, orders, total, rawCsv });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Không thể đọc file đơn hàng' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    ensureCsvFile();
    const { fullName, phone, address, productName, amount, note, orderDate } = req.body;

    if (!fullName || !phone || !address) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (họ tên, SĐT, địa chỉ)' });
      return;
    }

    const { orders } = parseCsvOrders();
    const newStt = orders.length > 0 ? Math.max(...orders.map((o) => o.stt)) + 1 : 1;

    // Date formatting DD/MM/YYYY
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFormatted = orderDate || `${day}/${month}/${year}`;

    const numAmount = typeof amount === 'number' ? amount : parseInt(String(amount || '0').replace(/[^0-9]/g, ''), 10) || 0;

    const newOrder: OrderItem = {
      stt: newStt,
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      productName: String(productName || 'Thiết bị thông minh Hunonic').trim(),
      orderDate: dateFormatted,
      amount: numAmount,
      note: String(note || '').trim(),
    };

    const updatedOrders = [...orders, newOrder];
    const newTotal = updatedOrders.reduce((sum, o) => sum + o.amount, 0);

    // Reconstruct CSV content matching exact format
    let csvContent = 'STT,Họ tên,SĐT,Địa chỉ,Sản phẩm mua,Ngày tháng năm,Số tiền thanh toán,Ghi chú\n';
    for (const o of updatedOrders) {
      csvContent += `${o.stt},${escapeCsvField(o.fullName)},${escapeCsvField(o.phone)},${escapeCsvField(o.address)},${escapeCsvField(o.productName)},${escapeCsvField(o.orderDate)},${o.amount},${escapeCsvField(o.note)}\n`;
    }
    csvContent += `,Tổng,,,,,,${newTotal},\n`.replace(',,,,,,', ',,,,,'); // matching ,Tổng,,,,,<total>,

    fs.writeFileSync(CSV_FILE_PATH, csvContent, 'utf-8');

    // Asynchronously dispatch to Google Sheet if configured
    let googleSheetSync = { success: false, message: 'Chưa cấu hình Google Sheet' };
    const sheetConfig = getGoogleSheetConfig();
    if (sheetConfig.autoSync && sheetConfig.webhookUrl) {
      googleSheetSync = await sendOrderToGoogleSheet(newOrder, sheetConfig);
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin đơn hàng thành công',
      order: newOrder,
      totalOrders: updatedOrders.length,
      totalAmount: newTotal,
      googleSheetSync,
    });
  } catch (err) {
    console.error('Error saving order to file:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lưu đơn hàng vào file' });
  }
});

// Google Sheet Configuration and Synchronization Endpoints
app.get('/api/google-sheet/config', (req, res) => {
  try {
    const config = getGoogleSheetConfig();
    res.json({
      success: true,
      config: {
        ...config,
        configured: Boolean(config.webhookUrl),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể đọc cấu hình Google Sheet' });
  }
});

app.post('/api/google-sheet/config', (req, res) => {
  try {
    const { webhookUrl, sheetUrl, autoSync } = req.body;
    const updated = saveGoogleSheetConfig({
      webhookUrl: typeof webhookUrl === 'string' ? webhookUrl.trim() : undefined,
      sheetUrl: typeof sheetUrl === 'string' ? sheetUrl.trim() : undefined,
      autoSync: typeof autoSync === 'boolean' ? autoSync : undefined,
    });
    res.json({
      success: true,
      message: 'Đã lưu cấu hình Google Sheet thành công',
      config: {
        ...updated,
        configured: Boolean(updated.webhookUrl),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi lưu cấu hình Google Sheet' });
  }
});

app.post('/api/google-sheet/test', async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    const targetWebhook = (webhookUrl || getGoogleSheetConfig().webhookUrl || '').trim();
    if (!targetWebhook) {
      res.status(400).json({ success: false, message: 'Vui lòng cung cấp URL Webhook Google Sheet' });
      return;
    }

    const testOrder: OrderItem = {
      stt: 999,
      fullName: 'Khách hàng thử nghiệm',
      phone: '0877999663',
      address: 'Kiểm tra đồng bộ Google Sheet',
      productName: 'Công Tắc Thông Minh Hunonic Luxury (Test)',
      orderDate: new Date().toLocaleDateString('vi-VN'),
      amount: 730000,
      note: 'Dữ liệu kiểm tra kết nối từ website Dien365 Hunonic',
    };

    const result = await sendOrderToGoogleSheet(testOrder, {
      webhookUrl: targetWebhook,
      sheetUrl: '',
      autoSync: true,
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Kết nối Google Sheet thành công! Dòng thử nghiệm đã được ghi vào Trang tính của bạn.',
      });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Lỗi khi kiểm tra kết nối' });
  }
});

app.post('/api/google-sheet/sync-all', async (req, res) => {
  try {
    const config = getGoogleSheetConfig();
    if (!config.webhookUrl) {
      res.status(400).json({
        success: false,
        message: 'Chưa cấu hình URL Webhook Google Sheet. Vui lòng dán link Webhook vào trước khi đồng bộ.',
      });
      return;
    }

    const { orders } = parseCsvOrders();
    if (orders.length === 0) {
      res.json({ success: true, message: 'Không có đơn hàng nào để đồng bộ', syncedCount: 0 });
      return;
    }

    let synced = 0;
    let failed = 0;

    for (const order of orders) {
      const result = await sendOrderToGoogleSheet(order, config);
      if (result.success) synced++;
      else failed++;
      // Wait 300ms between requests to avoid script rate-limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    res.json({
      success: true,
      message: `Đã đồng bộ ${synced}/${orders.length} đơn hàng sang Google Sheet!`,
      syncedCount: synced,
      failedCount: failed,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Lỗi trong quá trình đồng bộ hàng loạt' });
  }
});

// Download CSV endpoint (with UTF-8 BOM for Excel support)
app.get('/api/orders/download', (req, res) => {
  try {
    ensureCsvFile();
    const content = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const bom = '\uFEFF';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="dien_365_don_hang_hunonic.csv"');
    res.send(bom + content);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Không thể tải file');
  }
});

// Geocoding and address verification proxy for Google Maps / Viettel Post compliance
app.get('/api/address-lookup', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query || query.length < 3) {
      res.json({ success: true, suggestions: [] });
      return;
    }

    // Try OpenStreetMap Nominatim with timeout and VN country restriction
    const encoded = encodeURIComponent(`${query}, Vietnam`);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=vn&addressdetails=1&limit=5`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'HunonicSmartHomeViettelPostLookup/1.0',
          'Accept-Language': 'vi,en;q=0.9',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const suggestions = (data || []).map((item: any) => ({
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type,
          address: item.address,
        }));
        res.json({ success: true, suggestions });
        return;
      }
    } catch (fetchErr) {
      // Graceful fallback to client-side database
    }

    res.json({ success: true, suggestions: [] });
  } catch (err) {
    res.json({ success: false, suggestions: [] });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', contactPhone: '0877.999.663' });
});

// Serve public assets (including Hunonic images)
app.use(express.static(path.join(process.cwd(), 'public')));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
