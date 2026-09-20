import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const CSV_FILE_PATH = path.join(process.cwd(), 'orders.csv');

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

app.post('/api/orders', (req, res) => {
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

    res.json({
      success: true,
      message: 'Cập nhật thông tin đơn hàng vào file thành công',
      order: newOrder,
      totalOrders: updatedOrders.length,
      totalAmount: newTotal,
    });
  } catch (err) {
    console.error('Error saving order to file:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lưu đơn hàng vào file' });
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
