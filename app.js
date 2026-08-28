/* =========================================================
   ĐOÀN THƯỢNG BADMINTON - CORE SYSTEM LOGIC (APP.JS)
   - Quản trị viên (2 Admin):
     + nguyenducnhatminh1602 / minh226899@
     + nguyenduchieu / 0961708940
   - Thành viên đăng ký tự tạo & lưu trữ tự động
   - Duyệt thành viên, cộng/trừ điểm BWF
   - Tự động cập nhật bảng xếp hạng tức thì đa thiết bị/đa tab
========================================================= */

const STORAGE_KEY = 'DT_BADMINTON_DB_V1';
const SESSION_KEY = 'DT_BADMINTON_SESSION';
const BROADCAST_CHANNEL_NAME = 'dt_badminton_sync';

// Khởi tạo BroadcastChannel để đồng bộ tức thì giữa các tab
let syncChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch (e) {
  console.log('BroadcastChannel not supported');
}

// 1. DỮ LIỆU BAN ĐẦU (ADMIN CỐ ĐỊNH & VĐV MẪU)
const INITIAL_DATABASE = {
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
      categories: ['Đơn Nam', 'Đôi Nam', 'Đôi Nam Nữ'],
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
      categories: ['Đôi Nam', 'Đơn Nam'],
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
      categories: ['Đơn Nữ', 'Đôi Nữ', 'Đôi Nam Nữ'],
      points: 1850,
      prevRank: 4,
      status: 'active',
      joinDate: '2026-01-12',
      history: [
        { id: 'h_7', points: 1000, reason: 'Vô địch Đơn Nữ Đoàn Thượng 2026', date: '2026-01-20', by: 'nguyenducnhatminh1602' },
        { id: 'h_8', points: 850, reason: 'Huy chương Vàng Khối 11', date: '2026-02-15', by: 'nguyenduchieu' }
      ]
    },
    {
      id: 'mem_104',
      username: 'quanghuy10a1',
      password: '123',
      name: 'Phạm Quang Huy',
      class: '10A1',
      gender: 'Nam',
      category: 'Đơn Nam',
      categories: ['Đơn Nam', 'Đôi Nam'],
      points: 1620,
      prevRank: 3,
      status: 'active',
      joinDate: '2026-01-14',
      history: [
        { id: 'h_9', points: 800, reason: 'Vô địch Đơn Nam Khối 10', date: '2026-01-25', by: 'nguyenducnhatminh1602' },
        { id: 'h_10', points: 820, reason: 'Bán kết giải Mở rộng', date: '2026-02-18', by: 'nguyenduchieu' }
      ]
    },
    {
      id: 'mem_105',
      username: 'myduyen12a3',
      password: '123',
      name: 'Lê Mỹ Duyên',
      class: '12A3',
      gender: 'Nữ',
      category: 'Đôi Nữ',
      categories: ['Đôi Nữ', 'Đơn Nữ'],
      points: 1490,
      prevRank: 6,
      status: 'active',
      joinDate: '2026-01-15',
      history: [
        { id: 'h_11', points: 800, reason: 'Vô địch Đôi Nữ Toàn Trường', date: '2026-01-28', by: 'nguyenducnhatminh1602' },
        { id: 'h_12', points: 690, reason: 'Hạng Ba Đơn Nữ Mùa Xuân', date: '2026-02-14', by: 'nguyenduchieu' }
      ]
    },
    {
      id: 'mem_106',
      username: 'tuananh11a5',
      password: '123',
      name: 'Hoàng Tuấn Anh',
      class: '11A5',
      gender: 'Nam',
      category: 'Đôi Nam Nữ',
      categories: ['Đôi Nam Nữ', 'Đôi Nam'],
      points: 1350,
      prevRank: 5,
      status: 'active',
      joinDate: '2026-01-18',
      history: [
        { id: 'h_13', points: 750, reason: 'Á quân Đôi Nam Nữ Đoàn Thượng', date: '2026-02-02', by: 'nguyenduchieu' },
        { id: 'h_14', points: 600, reason: 'Thắng tứ kết giải Mùa Xuân', date: '2026-02-21', by: 'nguyenducnhatminh1602' }
      ]
    },
    {
      id: 'mem_107',
      username: 'baongoc10a4',
      password: '123',
      name: 'Đặng Bảo Ngọc',
      class: '10A4',
      gender: 'Nữ',
      category: 'Đôi Nam Nữ',
      categories: ['Đôi Nam Nữ', 'Đơn Nữ'],
      points: 1100,
      prevRank: 7,
      status: 'active',
      joinDate: '2026-01-20',
      history: [
        { id: 'h_15', points: 700, reason: 'Hạng Ba Đôi Nam Nữ', date: '2026-02-05', by: 'nguyenducnhatminh1602' },
        { id: 'h_16', points: 400, reason: 'Thắng trận vòng loại', date: '2026-02-16', by: 'nguyenduchieu' }
      ]
    },
    {
      id: 'mem_108',
      username: 'dangkhang11a1',
      password: '123',
      name: 'Vũ Đăng Khang',
      class: '11A1',
      gender: 'Nam',
      category: 'Đơn Nam',
      categories: ['Đơn Nam'],
      points: 950,
      prevRank: 8,
      status: 'active',
      joinDate: '2026-01-22',
      history: [
        { id: 'h_17', points: 500, reason: 'Điểm khởi tạo thành viên', date: '2026-01-22', by: 'nguyenducnhatminh1602' },
        { id: 'h_18', points: 450, reason: 'Tứ kết giải Khối 11', date: '2026-02-12', by: 'nguyenduchieu' }
      ]
    },
    {
      id: 'mem_pending_1',
      username: 'thanhbinh10a2',
      password: '123',
      name: 'Ngô Thanh Bình',
      class: '10A2',
      gender: 'Nam',
      category: 'Đơn Nam',
      categories: ['Đơn Nam', 'Đôi Nam'],
      points: 0,
      prevRank: 0,
      status: 'pending',
      joinDate: '2026-02-28',
      history: []
    }
  ],
  friends: [
    { id: 'fr_1', fromId: 'mem_101', toId: 'mem_102', status: 'accepted', createdAt: '2026-01-10' },
    { id: 'fr_2', fromId: 'mem_101', toId: 'mem_103', status: 'accepted', createdAt: '2026-01-15' },
    { id: 'fr_3', fromId: 'mem_103', toId: 'mem_105', status: 'accepted', createdAt: '2026-01-20' }
  ],
  messages: [
    { id: 'msg_1', fromId: 'mem_101', toId: 'mem_102', content: 'Chiều nay 17h ra sân tập đôi nam nhé Hiếu!', timestamp: '2026-02-27 15:30', read: true },
    { id: 'msg_2', fromId: 'mem_102', toId: 'mem_101', content: 'Ok Minh, mình mang vợt mới ra giao lưu luôn!', timestamp: '2026-02-27 15:32', read: true }
  ],
  matchInvites: [
    {
      id: 'inv_1',
      fromId: 'mem_101',
      fromName: 'Nguyễn Đức Nhật Minh',
      toId: 'mem_104',
      toName: 'Phạm Quang Huy',
      category: 'Đơn Nam',
      date: '2026-03-02',
      time: '17:00',
      venue: 'Sân 1 - Nhà đa năng',
      note: 'Giao lưu 3 set tính điểm BWF thách đấu!',
      status: 'pending',
      createdAt: '2026-02-28'
    }
  ],
  news: [
    {
      id: 'news_1',
      title: 'Khai Mạc Giải Cầu Lông Đoàn Thượng Mùa Xuân 2026 - Tranh Cúp BWF Đoàn Thượng',
      category: 'Giải Đấu',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      summary: 'Giải đấu quy tụ hơn 50 tay vợt xuất sắc nhất từ các khối 10, 11 và 12 tham gia tranh tài ở 5 nội dung chính thức.',
      content: 'Nhằm thúc đẩy phong trào rèn luyện thể dục thể thao và tìm kiếm những tài năng cầu lông cho trường, CLB Đoàn Thượng Badminton chính thức khởi tranh Giải Cầu Lông Mùa Xuân 2026.\n\nGiải đấu diễn ra với 5 nội dung: Đơn Nam, Đơn Nữ, Đôi Nam, Đôi Nữ và Đôi Nam Nữ. Tất cả các trận đấu đều được tính điểm trực tiếp vào Bảng Xếp Hạng BWF Đoàn Thượng.\n\nNhà vô địch mỗi nội dung sẽ được cộng trực tiếp +1000 điểm BWF, cúp vô địch và huy chương vàng danh giá!',
      author: 'Nguyễn Đức Nhật Minh',
      date: '2026-02-20'
    },
    {
      id: 'news_2',
      title: 'Thông Báo Lịch Tập Huấn & Thách Đấu CLB Đoàn Thượng Badminton Tháng 3',
      category: 'Thông Báo',
      image: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80',
      summary: 'Lịch sinh hoạt thường niên vào các buổi chiều Thứ 3, Thứ 5 và Chủ Nhật tại nhà đa năng trường THPT Đoàn Thượng.',
      content: 'Ban Quản Trị CLB thông báo lịch sinh hoạt và giao lưu cầu lông tháng 3/2026:\n\n- Thời gian: 16h30 - 18h30 (Thứ 3, Thứ 5, Chủ Nhật hàng tuần).\n- Địa điểm: Nhà thi đấu đa năng.\n- Hoạt động: Khởi động thể lực, chia bảng thi đấu giao hữu tính điểm (+100 điểm cho mỗi trận thắng thách đấu).\n\nĐề nghị các thành viên mang giày chuyên dụng và trang phục thể thao đúng quy định.',
      author: 'Nguyễn Đức Hiếu',
      date: '2026-02-25'
    },
    {
      id: 'news_3',
      title: 'Bí Quyết Thực Hiện Cú Đập Cầu Smash Uy Lực & Chuẩn Xác Theo Tiêu Chuẩn BWF',
      category: 'Kỹ Thuật',
      image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=800&q=80',
      summary: 'Hướng dẫn chi tiết từ tư thế chân, điểm tiếp xúc cầu đến kỹ thuật xoay cổ tay để tạo ra cú smash cắm sàn hiệu quả.',
      content: 'Cú đập cầu (Smash) là vũ khí tấn công ghi điểm quan trọng nhất trong môn cầu lông:\n\n1. Bước di chuyển: Lùi chân về phía sau quả cầu để lấy đà bật nhảy.\n2. Điểm tiếp xúc: Đón cầu ở vị trí cao nhất trước mặt, chếch khoảng 45 độ.\n3. Cổ tay: Gập cổ tay nhanh và dứt khoát tại thời điểm tiếp xúc mặt vợt.\n4. Thu hồi bộ: Nhanh chóng đưa vợt về vị trí thủ để sẵn sàng cho đường cầu tiếp theo.\n\nChúc các VĐV Đoàn Thượng luyện tập thành công và đạt thứ hạng cao trên BXH!',
      author: 'Nguyễn Đức Nhật Minh',
      date: '2026-02-28'
    }
  ],
  systemLog: []
};

// 2. CÁC HÀM XỬ LÝ CƠ SỞ DỮ LIỆU & ĐỒNG BỘ CLOUD TOÀN MẠNG
let isServerAvailable = false;
let isCloudSyncActive = false;
let firebaseDbRef = null;

// Cấu hình Cloud Sync mặc định (Hỗ trợ Firebase Realtime Database & REST API)
const DEFAULT_CLOUD_CONFIG = {
  enabled: true,
  provider: 'firebase', // 'firebase' hoặc 'custom'
  // Cấu hình Firebase Realtime DB miễn phí mẫu
  apiKey: "AIzaSyDoanThuongBadmintonKey2026",
  databaseURL: "https://doan-thuong-badminton-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "doan-thuong-badminton"
};

// Khởi tạo Cloud Realtime Sync
function initCloudSync() {
  const customConfig = getCloudConfig();
  if (typeof firebase !== 'undefined' && customConfig && customConfig.databaseURL) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(customConfig);
      }
      const db = firebase.database();
      firebaseDbRef = db.ref('dt_badminton_data');
      
      // Lắng nghe dữ liệu thay đổi từ Cloud theo thời gian thực (Real-time Listener)
      firebaseDbRef.on('value', (snapshot) => {
        const cloudData = snapshot.val();
        if (cloudData && cloudData.members) {
          isCloudSyncActive = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          updateCloudStatusUI(true);
          if (typeof renderAll === 'function') renderAll();
          if (typeof renderAllAdminTabs === 'function') renderAllAdminTabs();
        }
      }, (error) => {
        console.log('Firebase Cloud Realtime (Sử dụng Local & Broadcast Fallback):', error);
        updateCloudStatusUI(false);
      });
    } catch (e) {
      console.log('Không thể khởi tạo Firebase Realtime:', e);
      updateCloudStatusUI(false);
    }
  }
}

function getCloudConfig() {
  const saved = localStorage.getItem('DT_BADMINTON_CLOUD_CONFIG');
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return DEFAULT_CLOUD_CONFIG;
}

function saveCloudConfig(config) {
  localStorage.setItem('DT_BADMINTON_CLOUD_CONFIG', JSON.stringify(config));
  initCloudSync();
}

function updateCloudStatusUI(online) {
  const statusBadge = document.getElementById('cloudStatusBadge');
  if (statusBadge) {
    if (online) {
      statusBadge.innerHTML = `<span class="live-dot" style="background:#10B981;"></span> <span>ĐỒNG BỘ ONLINE TOÀN TRƯỜNG</span>`;
      statusBadge.style.color = '#10B981';
    } else {
      statusBadge.innerHTML = `<span class="live-dot" style="background:#3B82F6;"></span> <span>ĐỒNG BỘ THỜI GIAN THỰC</span>`;
      statusBadge.style.color = 'var(--bwf-red-light)';
    }
  }
}

// Tự động kiểm tra API server nếu chạy trên http/https
async function checkServerSync() {
  if (window.location.protocol.startsWith('http')) {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const serverData = await res.json();
        isServerAvailable = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        if (typeof renderAll === 'function') renderAll();
        if (typeof renderAllAdminTabs === 'function') renderAllAdminTabs();
      }
    } catch (e) {
      isServerAvailable = false;
    }
  }
}

// Khởi chạy khi tải trang
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initCloudSync();
    checkServerSync();
  });
}

function getDB() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveDB(INITIAL_DATABASE);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }
  try {
    const parsed = JSON.parse(data);
    // Đảm bảo luôn có 2 tài khoản admin được bảo vệ
    ensureAdminsExist(parsed);
    return parsed;
  } catch (e) {
    console.error('Lỗi đọc CSDL, khôi phục mặc định:', e);
    saveDB(INITIAL_DATABASE);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    
    // 1. Đồng bộ lên Cloud Realtime Database (để tất cả điện thoại/máy tính khác nhận được ngay)
    if (firebaseDbRef) {
      firebaseDbRef.set(db).catch(err => console.log('Lỗi sync Firebase:', err));
    }

    // 2. Nếu chạy qua HTTP Server, gửi đồng bộ lên file database.json
    if (window.location.protocol.startsWith('http')) {
      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      }).catch(err => console.log('Không thể gửi lên server:', err));
    }

    // 3. Phát tín hiệu đồng bộ cho các tab khác
    if (syncChannel) {
      syncChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
    }
  } catch (e) {
    console.error('Lỗi lưu CSDL:', e);
  }
}

function ensureAdminsExist(db) {
  if (!db.admins || !Array.isArray(db.admins)) {
    db.admins = INITIAL_DATABASE.admins;
    saveDB(db);
    return;
  }
  
  INITIAL_DATABASE.admins.forEach(reqAdmin => {
    const exists = db.admins.some(a => a.username.toLowerCase() === reqAdmin.username.toLowerCase());
    if (!exists) {
      db.admins.push(reqAdmin);
      saveDB(db);
    }
  });
}

// 3. QUẢN LÝ PHIÊN ĐĂNG NHẬP (AUTH SESSION)
function getSession() {
  const sess = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  if (!sess) return null;
  try {
    return JSON.parse(sess);
  } catch (e) {
    return null;
  }
}

function setSession(user, remember = false) {
  const str = JSON.stringify(user);
  sessionStorage.setItem(SESSION_KEY, str);
  if (remember) {
    localStorage.setItem(SESSION_KEY, str);
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// Đăng nhập hệ thống
function loginUser(username, password) {
  const db = getDB();
  const uname = username.trim();
  const pass = password.trim();

  // Kiểm tra tài khoản Admin (2 tài khoản bắt buộc)
  const admin = db.admins.find(a => a.username.toLowerCase() === uname.toLowerCase() && a.password === pass);
  if (admin) {
    const sessionData = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: 'ADMIN',
      isAdmin: true
    };
    setSession(sessionData, true);
    return { success: true, user: sessionData, message: `Chào mừng Quản trị viên ${admin.name}!` };
  }

  // Kiểm tra tài khoản Thành viên
  const member = db.members.find(m => m.username.toLowerCase() === uname.toLowerCase() && m.password === pass);
  if (member) {
    if (member.status === 'pending') {
      return { 
        success: false, 
        message: 'Tài khoản của bạn đang trong trạng thái CHỜ ADMIN PHÊ DUYỆT. Vui lòng liên hệ Admin để được duyệt vào Bảng Xếp Hạng.' 
      };
    }
    const sessionData = {
      id: member.id,
      username: member.username,
      name: member.name,
      class: member.class,
      gender: member.gender,
      category: member.category,
      points: member.points,
      role: 'MEMBER',
      isAdmin: false
    };
    setSession(sessionData, true);
    return { success: true, user: sessionData, message: `Đăng nhập thành công! Chào ${member.name}` };
  }

  return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
}

// 4. ĐĂNG KÝ THÀNH VIÊN MỚI
function registerNewMember(formData) {
  const db = getDB();
  const uname = formData.username.trim();

  // Kiểm tra trùng tên đăng nhập với Admin
  if (db.admins.some(a => a.username.toLowerCase() === uname.toLowerCase())) {
    return { success: false, message: 'Tên đăng nhập này đã được sử dụng!' };
  }

  // Kiểm tra trùng tên đăng nhập với thành viên khác
  if (db.members.some(m => m.username.toLowerCase() === uname.toLowerCase())) {
    return { success: false, message: 'Tên đăng nhập đã tồn tại trong hệ thống. Vui lòng chọn tên khác!' };
  }

  const cats = Array.isArray(formData.categories) && formData.categories.length > 0 
    ? formData.categories 
    : [formData.category || 'Đơn Nam'];

  const newMember = {
    id: 'mem_' + Date.now(),
    username: uname,
    password: formData.password,
    name: formData.name.trim(),
    class: formData.class.trim(),
    gender: formData.gender,
    category: cats[0],
    categories: cats,
    points: 0,
    prevRank: 0,
    status: 'pending', // Chờ admin duyệt
    joinDate: new Date().toISOString().split('T')[0],
    history: []
  };

  db.members.push(newMember);
  saveDB(db);

  return { 
    success: true, 
    message: 'Đăng ký thành công! Hồ sơ của bạn đã được gửi cho Quản trị viên (Admin) phê duyệt.' 
  };
}

// 5. TÍNH TOÁN VÀ XẾP HẠNG THÀNH VIÊN (BWF ALGORITHM - HỖ TRỢ ĐA NỘI DUNG)
function getRankings(filterCategory = 'ALL', filterClass = 'ALL', filterGender = 'ALL', searchQuery = '') {
  const db = getDB();
  
  // Chỉ lấy thành viên đã được kích hoạt (active)
  let list = db.members.filter(m => m.status === 'active');

  // Đảm bảo thành viên luôn có mảng categories
  list.forEach(m => {
    if (!m.categories || !Array.isArray(m.categories)) {
      m.categories = m.category ? [m.category] : ['Đơn Nam'];
    }
  });

  // Lọc theo nội dung (VĐV tham gia nhiều nội dung sẽ xuất hiện ở tất cả các bảng phù hợp)
  if (filterCategory && filterCategory !== 'ALL') {
    list = list.filter(m => (m.categories && m.categories.includes(filterCategory)) || m.category === filterCategory);
  }

  // Lọc theo Lớp
  if (filterClass && filterClass !== 'ALL') {
    list = list.filter(m => m.class.toLowerCase().includes(filterClass.toLowerCase()));
  }

  // Lọc theo Giới tính
  if (filterGender && filterGender !== 'ALL') {
    list = list.filter(m => m.gender === filterGender);
  }

  // Lọc theo từ khóa tìm kiếm
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.username.toLowerCase().includes(q) || 
      m.class.toLowerCase().includes(q)
    );
  }

  // Sắp xếp theo Điểm từ cao xuống thấp
  list.sort((a, b) => b.points - a.points);

  // Gán thứ hạng & tính toán thay đổi hạng
  return list.map((item, index) => {
    const currentRank = index + 1;
    let rankChange = 0; // 0: cùng bậc, dương: tăng hạng, âm: tụt hạng
    if (item.prevRank && item.prevRank > 0) {
      rankChange = item.prevRank - currentRank; // ví dụ: trước rank 4, nay rank 2 => +2
    }
    return {
      ...item,
      rank: currentRank,
      rankChange: rankChange
    };
  });
}

// 6. CÁC HÀM DÀNH CHO ADMIN
// Phê duyệt thành viên
function approveMember(memberId, initialPoints = 100, reason = 'Khởi tạo điểm thành viên mới') {
  const db = getDB();
  const member = db.members.find(m => m.id === memberId);
  if (!member) return { success: false, message: 'Không tìm thấy thành viên!' };

  member.status = 'active';
  if (initialPoints > 0) {
    member.points = Number(initialPoints);
    member.history.push({
      id: 'h_' + Date.now(),
      points: Number(initialPoints),
      reason: reason || 'Phê duyệt gia nhập Đoàn Thượng Badminton',
      date: new Date().toISOString().split('T')[0],
      by: getSession()?.username || 'Admin'
    });
  }
  
  saveDB(db);
  return { success: true, message: `Đã phê duyệt thành công thành viên: ${member.name}!` };
}

// Từ chối / Xóa thành viên
function deleteMember(memberId) {
  const db = getDB();
  const idx = db.members.findIndex(m => m.id === memberId);
  if (idx === -1) return { success: false, message: 'Không tìm thấy thành viên!' };

  const deletedName = db.members[idx].name;
  db.members.splice(idx, 1);
  saveDB(db);
  return { success: true, message: `Đã xóa thành viên: ${deletedName} khỏi hệ thống.` };
}

// Thêm thành viên trực tiếp từ Admin
function addMemberDirectly(data) {
  const db = getDB();
  const uname = data.username.trim();

  if (db.members.some(m => m.username.toLowerCase() === uname.toLowerCase()) || 
      db.admins.some(a => a.username.toLowerCase() === uname.toLowerCase())) {
    return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
  }

  const initialPoints = Number(data.points) || 0;
  const newMember = {
    id: 'mem_' + Date.now(),
    username: uname,
    password: data.password || '123456',
    name: data.name.trim(),
    class: data.class.trim(),
    gender: data.gender,
    category: data.category,
    points: initialPoints,
    prevRank: 0,
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    history: initialPoints > 0 ? [{
      id: 'h_' + Date.now(),
      points: initialPoints,
      reason: data.reason || 'Điểm ban đầu khi tạo tài khoản',
      date: new Date().toISOString().split('T')[0],
      by: getSession()?.username || 'Admin'
    }] : []
  };

  db.members.push(newMember);
  saveDB(db);
  return { success: true, message: `Đã thêm thành viên ${newMember.name} thành công!` };
}

// Sửa thông tin thành viên
function updateMemberInfo(memberId, updateData) {
  const db = getDB();
  const member = db.members.find(m => m.id === memberId);
  if (!member) return { success: false, message: 'Không tìm thấy thành viên!' };

  if (updateData.name) member.name = updateData.name.trim();
  if (updateData.class) member.class = updateData.class.trim();
  if (updateData.gender) member.gender = updateData.gender;
  if (updateData.category) member.category = updateData.category;
  if (updateData.password && updateData.password.trim() !== '') {
    member.password = updateData.password.trim();
  }

  saveDB(db);
  return { success: true, message: 'Cập nhật thông tin thành công!' };
}

// Cộng / Trừ điểm cho thành viên
function adjustMemberPoints(memberId, pointsDiff, reason, tournamentName = '') {
  const db = getDB();
  const member = db.members.find(m => m.id === memberId);
  if (!member) return { success: false, message: 'Không tìm thấy thành viên!' };

  const diff = Number(pointsDiff);
  if (isNaN(diff) || diff === 0) {
    return { success: false, message: 'Số điểm thay đổi không hợp lệ!' };
  }

  // Lưu lại thứ hạng trước khi cộng điểm
  const rankingsBefore = getRankings();
  const currentMemberRank = rankingsBefore.findIndex(m => m.id === memberId) + 1;
  member.prevRank = currentMemberRank > 0 ? currentMemberRank : 0;

  // Cập nhật điểm mới (không cho phép âm điểm)
  member.points = Math.max(0, (member.points || 0) + diff);

  const adminName = getSession()?.username || 'Admin';
  const desc = tournamentName ? `[${tournamentName}] ${reason}` : reason;

  member.history = member.history || [];
  member.history.unshift({
    id: 'h_' + Date.now(),
    points: diff,
    reason: desc || 'Cập nhật điểm từ Admin',
    date: new Date().toISOString().split('T')[0],
    by: adminName
  });

  saveDB(db);
  return { 
    success: true, 
    message: `Đã ${diff > 0 ? 'cộng' : 'trừ'} ${Math.abs(diff)} điểm cho VĐV ${member.name}. Điểm hiện tại: ${member.points} điểm.` 
  };
}

// Xuất file dữ liệu JSON sao lưu
function exportDatabaseJSON() {
  const db = getDB();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `DoanThuong_Badminton_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Nhập dữ liệu JSON từ file
function importDatabaseJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.members || !Array.isArray(parsed.members)) {
      return { success: false, message: 'File dữ liệu không đúng định dạng của hệ thống!' };
    }
    ensureAdminsExist(parsed);
    saveDB(parsed);
    return { success: true, message: 'Khôi phục dữ liệu thành công!' };
  } catch (e) {
    return { success: false, message: 'Lỗi đọc file JSON: ' + e.message };
  }
}

// Reset về dữ liệu mẫu ban đầu
function resetDatabase() {
  saveDB(INITIAL_DATABASE);
  return { success: true, message: 'Đã thiết lập lại dữ liệu mẫu thành công!' };
}

// 7. TIỆN ÍCH TOAST THÔNG BÁO GIAO DIỆN
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'danger') icon = '⚠️';
  if (type === 'warning') icon = '🔔';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 8. CÁC HÀM QUẢN LÝ BẢN TIN CẦU LÔNG & TẢI HÌNH ẢNH
function getNewsList() {
  const db = getDB();
  if (!db.news || !Array.isArray(db.news)) {
    db.news = INITIAL_DATABASE.news || [];
    saveDB(db);
  }
  // Sắp xếp bài viết mới nhất lên trước
  return [...db.news].sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
}

function addNewsItem(newsData) {
  try {
    const db = getDB();
    db.news = db.news || [];

    const session = getSession();
    const authorName = session?.name || session?.username || 'Ban Quản Trị';

    const newPost = {
      id: 'news_' + Date.now(),
      title: (newsData.title || '').trim(),
      category: newsData.category || 'Tin Tức',
      image: newsData.image || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      summary: (newsData.summary || '').trim(),
      content: (newsData.content || '').trim(),
      author: authorName,
      date: new Date().toISOString().split('T')[0]
    };

    db.news.unshift(newPost);
    saveDB(db);
    return { success: true, message: 'Đăng bản tin cầu lông thành công!', post: newPost };
  } catch (err) {
    console.error('Lỗi addNewsItem:', err);
    return { success: false, message: 'Lỗi khi lưu bài viết: ' + err.message };
  }
}

function updateNewsItem(newsId, updateData) {
  try {
    const db = getDB();
    db.news = db.news || [];
    const idx = db.news.findIndex(n => n.id === newsId);
    if (idx === -1) return { success: false, message: 'Không tìm thấy bản tin cần sửa!' };

    db.news[idx].title = (updateData.title || '').trim();
    db.news[idx].category = updateData.category || 'Tin Tức';
    if (updateData.image) db.news[idx].image = updateData.image;
    db.news[idx].summary = (updateData.summary || '').trim();
    db.news[idx].content = (updateData.content || '').trim();

    saveDB(db);
    return { success: true, message: 'Cập nhật bản tin thành công!' };
  } catch (err) {
    console.error('Lỗi updateNewsItem:', err);
    return { success: false, message: 'Lỗi khi cập nhật bài viết: ' + err.message };
  }
}

function deleteNewsItem(newsId) {
  try {
    const db = getDB();
    db.news = db.news || [];
    const idx = db.news.findIndex(n => n.id === newsId);
    if (idx === -1) return { success: false, message: 'Không tìm thấy bản tin cần xóa!' };

    const title = db.news[idx].title;
    db.news.splice(idx, 1);
    saveDB(db);
    return { success: true, message: `Đã xóa bản tin: "${title}"` };
  } catch (err) {
    console.error('Lỗi deleteNewsItem:', err);
    return { success: false, message: 'Lỗi khi xóa bài viết: ' + err.message };
  }
}

// Hàm nén ảnh tải lên từ máy tính / điện thoại thành Base64 nhẹ nhàng để lưu trữ
function compressImageFile(file, maxWidth = 800, maxHeight = 500, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP)!'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Xuất ra định dạng JPEG nén chất lượng cao, dung lượng nhẹ
          const base64Data = canvas.toDataURL('image/jpeg', quality);
          resolve(base64Data);
        } catch (canvasErr) {
          // Fallback nếu canvas bị lỗi
          console.warn('Canvas resize fallback:', canvasErr);
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// 9. QUẢN LÝ ĐA NỘI DUNG (MULTI-CATEGORY MANAGEMENT)
function updateMemberCategories(memberId, newCategories) {
  try {
    const db = getDB();
    const member = db.members.find(m => m.id === memberId);
    if (!member) return { success: false, message: 'Không tìm thấy thành viên!' };

    if (!Array.isArray(newCategories) || newCategories.length === 0) {
      return { success: false, message: 'Vui lòng chọn ít nhất 1 nội dung thi đấu!' };
    }

    member.categories = newCategories;
    member.category = newCategories[0]; // Nội dung chính
    saveDB(db);

    // Cập nhật session nếu đang đăng nhập
    const sess = getSession();
    if (sess && sess.id === memberId) {
      sess.category = member.category;
      sess.categories = member.categories;
      setSession(sess, true);
    }

    return { success: true, message: 'Cập nhật các nội dung thi đấu thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

// 10. HỆ THỐNG KẾT BẠN (FRIENDS & SOCIAL SYSTEM)
function getFriendshipStatus(id1, id2) {
  if (id1 === id2) return 'self';
  const db = getDB();
  db.friends = db.friends || [];

  const rel = db.friends.find(f => 
    (f.fromId === id1 && f.toId === id2) || (f.fromId === id2 && f.toId === id1)
  );

  if (!rel) return 'none';
  if (rel.status === 'accepted') return 'friends';
  if (rel.fromId === id1 && rel.status === 'pending') return 'pending_sent';
  if (rel.toId === id1 && rel.status === 'pending') return 'pending_received';
  return 'none';
}

function sendFriendRequest(fromId, toId) {
  try {
    const db = getDB();
    db.friends = db.friends || [];

    const existing = db.friends.find(f => 
      (f.fromId === fromId && f.toId === toId) || (f.fromId === toId && f.toId === fromId)
    );

    if (existing) {
      if (existing.status === 'accepted') return { success: false, message: 'Hai bạn đã là bạn bè!' };
      return { success: false, message: 'Lời mời kết bạn đã tồn tại!' };
    }

    const newReq = {
      id: 'fr_' + Date.now(),
      fromId: fromId,
      toId: toId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.friends.push(newReq);
    saveDB(db);
    return { success: true, message: 'Đã gửi lời mời kết bạn thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

function acceptFriendRequest(requestId) {
  try {
    const db = getDB();
    db.friends = db.friends || [];
    const req = db.friends.find(f => f.id === requestId);
    if (!req) return { success: false, message: 'Không tìm thấy lời mời kết bạn!' };

    req.status = 'accepted';
    saveDB(db);
    return { success: true, message: 'Đã chấp nhận lời mời kết bạn!' };
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

function declineFriendRequest(requestId) {
  try {
    const db = getDB();
    db.friends = db.friends || [];
    const idx = db.friends.findIndex(f => f.id === requestId);
    if (idx === -1) return { success: false, message: 'Không tìm thấy lời mời!' };

    db.friends.splice(idx, 1);
    saveDB(db);
    return { success: true, message: 'Đã hủy lời mời kết bạn.' };
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

function getFriendsList(memberId) {
  const db = getDB();
  db.friends = db.friends || [];
  
  const friendIds = [];
  db.friends.forEach(f => {
    if (f.status === 'accepted') {
      if (f.fromId === memberId) friendIds.push(f.toId);
      else if (f.toId === memberId) friendIds.push(f.fromId);
    }
  });

  return db.members.filter(m => friendIds.includes(m.id) && m.status === 'active');
}

function getPendingFriendRequests(memberId) {
  const db = getDB();
  db.friends = db.friends || [];

  const received = db.friends.filter(f => f.toId === memberId && f.status === 'pending');
  return received.map(req => {
    const sender = db.members.find(m => m.id === req.fromId);
    return {
      requestId: req.id,
      sender: sender || { name: 'Thành viên CLB', class: 'THPT Đoàn Thượng' },
      createdAt: req.createdAt
    };
  });
}

// 11. HỆ THỐNG TRÒ CHUYỆN (DIRECT CHAT & MESSENGER)
function sendMessage(fromId, toId, content) {
  try {
    if (!content || !content.trim()) return { success: false, message: 'Nội dung tin nhắn không được để trống!' };
    const db = getDB();
    db.messages = db.messages || [];

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate()}/${now.getMonth() + 1}`;

    const newMsg = {
      id: 'msg_' + Date.now(),
      fromId: fromId,
      toId: toId,
      content: content.trim(),
      timestamp: timeStr,
      read: false
    };

    db.messages.push(newMsg);
    saveDB(db);
    return { success: true, message: 'Đã gửi tin nhắn!', msg: newMsg };
  } catch (err) {
    return { success: false, message: 'Lỗi gửi tin nhắn: ' + err.message };
  }
}

function getConversation(id1, id2) {
  const db = getDB();
  db.messages = db.messages || [];

  return db.messages.filter(m => 
    (m.fromId === id1 && m.toId === id2) || (m.fromId === id2 && m.toId === id1)
  );
}

function markConversationRead(fromId, toId) {
  const db = getDB();
  db.messages = db.messages || [];
  let updated = false;

  db.messages.forEach(m => {
    if (m.fromId === fromId && m.toId === toId && !m.read) {
      m.read = true;
      updated = true;
    }
  });

  if (updated) saveDB(db);
}

function getUnreadMessagesCount(memberId) {
  const db = getDB();
  db.messages = db.messages || [];
  return db.messages.filter(m => m.toId === memberId && !m.read).length;
}

// 12. HỆ THỐNG MỜI GHÉP TRẬN / THÁCH ĐẤU (MATCHMAKING & INVITES)
function sendMatchInvite(data) {
  try {
    const db = getDB();
    db.matchInvites = db.matchInvites || [];

    const newInvite = {
      id: 'inv_' + Date.now(),
      fromId: data.fromId,
      fromName: data.fromName,
      toId: data.toId,
      toName: data.toName,
      category: data.category || 'Đơn Nam',
      date: data.date,
      time: data.time,
      venue: data.venue || 'Nhà thi đấu đa năng',
      note: data.note || 'Mời giao lưu cầu lông',
      status: 'pending', // 'pending' | 'accepted' | 'declined' | 'completed'
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.matchInvites.unshift(newInvite);
    saveDB(db);
    return { success: true, message: `Đã gửi lời mời ghép trận tới ${data.toName}!`, invite: newInvite };
  } catch (err) {
    return { success: false, message: 'Lỗi gửi lời mời: ' + err.message };
  }
}

function respondMatchInvite(inviteId, newStatus) {
  try {
    const db = getDB();
    db.matchInvites = db.matchInvites || [];
    const inv = db.matchInvites.find(i => i.id === inviteId);
    if (!inv) return { success: false, message: 'Không tìm thấy lời mời thi đấu!' };

    inv.status = newStatus;
    saveDB(db);
    const msg = newStatus === 'accepted' ? 'Đã chấp nhận lời mời ghép trận!' : 'Đã từ chối lời mời.';
    return { success: true, message: msg };
  } catch (err) {
    return { success: false, message: 'Lỗi: ' + err.message };
  }
}

function getMemberMatchInvites(memberId) {
  const db = getDB();
  db.matchInvites = db.matchInvites || [];

  const received = db.matchInvites.filter(i => i.toId === memberId);
  const sent = db.matchInvites.filter(i => i.fromId === memberId);

  return { received, sent };
}



