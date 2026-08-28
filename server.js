const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Khởi tạo file CSDL mặc định nếu chưa có
function initDBFile() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      admins: [
        {
          id: 'admin_1',
          username: 'nguyenducnhatminh1602',
          password: 'minh226899@',
          name: 'Nguyễn Đức Nhật Minh',
          role: 'SUPER_ADMIN'
        },
        {
          id: 'admin_2',
          username: 'nguyenduchieu',
          password: '0961708940',
          name: 'Nguyễn Đức Hiếu',
          role: 'SUPER_ADMIN'
        }
      ],
      members: [
        {
          id: 'mem_101',
          username: 'nhatminh_player',
          password: '123',
          name: 'Nguyễn Đức Nhật Minh',
          class: '12A1',
          gender: 'Nam',
          category: 'Đơn Nam',
          points: 2450,
          prevRank: 1,
          status: 'active',
          joinDate: '2026-01-10',
          history: [
            { id: 'h_1', points: 1000, reason: 'Vô địch Giải Cầu Lông Mở Rộng Đoàn Thượng', date: '2026-01-15', by: 'Hệ thống' },
            { id: 'h_2', points: 800, reason: 'Huy chương Vàng Đơn Nam Khối 12', date: '2026-02-10', by: 'nguyenduchieu' },
            { id: 'h_3', points: 650, reason: 'Thắng 3 trận giao lưu đầu xuân', date: '2026-02-20', by: 'nguyenducnhatminh1602' }
          ]
        },
        {
          id: 'mem_102',
          username: 'duchieu_player',
          password: '123',
          name: 'Nguyễn Đức Hiếu',
          class: '12A1',
          gender: 'Nam',
          category: 'Đôi Nam',
          points: 2200,
          prevRank: 2,
          status: 'active',
          joinDate: '2026-01-10',
          history: [
            { id: 'h_4', points: 900, reason: 'Vô địch Đôi Nam Toàn Trường', date: '2026-01-18', by: 'nguyenducnhatminh1602' },
            { id: 'h_5', points: 800, reason: 'Hạng Nhì Đơn Nam Mùa Xuân', date: '2026-02-10', by: 'nguyenducnhatminh1602' },
            { id: 'h_6', points: 500, reason: 'Thắng trận giao hữu CLB', date: '2026-02-22', by: 'nguyenduchieu' }
          ]
        },
        {
          id: 'mem_103',
          username: 'thuhuong11a2',
          password: '123',
          name: 'Trần Thu Hương',
          class: '11A2',
          gender: 'Nữ',
          category: 'Đơn Nữ',
          points: 1850,
          prevRank: 4,
          status: 'active',
          joinDate: '2026-01-12',
          history: [
            { id: 'h_7', points: 1000, reason: 'Vô địch Đơn Nữ Đoàn Thượng 2026', date: '2026-01-20', by: 'nguyenducnhatminh1602' }
          ]
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('Đã tạo file database.json khởi tạo.');
  }
}

initDBFile();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: Lấy CSDL
  if (req.url === '/api/db' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Lỗi đọc CSDL' }));
    }
    return;
  }

  // API Endpoint: Lưu CSDL
  if (req.url === '/api/db' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Đã lưu CSDL thành công' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Dữ liệu JSON không hợp lệ' }));
      }
    });
    return;
  }

  // Serve static files
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found - Không tìm thấy trang</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏸 ĐOÀN THƯỢNG BADMINTON SERVER ĐANG CHẠY!`);
  console.log(`🌐 Truy cập trang chủ: http://localhost:${PORT}`);
  console.log(`⚙️ Trang Admin:       http://localhost:${PORT}/admin.html`);
  console.log(`👑 2 Tài khoản Admin:`);
  console.log(`   1. nguyenducnhatminh1602 / minh226899@`);
  console.log(`   2. nguyenduchieu / 0961708940`);
  console.log(`=======================================================`);
});
