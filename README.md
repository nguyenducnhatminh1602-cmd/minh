# 🏸 Hướng Dẫn Sử Dụng: Website Bảng Xếp Hạng Đoàn Thượng Badminton

Chào mừng bạn đến với hệ thống website Bảng Xếp Hạng Cầu Lông **Đoàn Thượng Badminton** thiết kế theo tiêu chuẩn giao diện BWF (Badminton World Federation)!

---

## 👑 1. Thông Tin Tài Khoản Quản Trị Viên (Admin)

Hệ thống được thiết lập sẵn **2 tài khoản Admin có toàn quyền quản trị**:

| STT | Họ và Tên Admin | Tên đăng nhập | Mật khẩu | Quyền hạn |
|:---:|:---|:---|:---|:---|
| **1** | **Nguyễn Đức Nhật Minh** | `nguyenducnhatminh1602` | `minh226899@` | Quản trị viên cấp cao |
| **2** | **Nguyễn Đức Hiếu** | `nguyenduchieu` | `0961708940` | Quản trị viên cấp cao |

> [!IMPORTANT]
> - Chỉ 2 tài khoản trên mới có thể truy cập trang Quản Trị: `admin.html`.
> - Admin có quyền: Duyệt thành viên mới đăng ký, thêm/xóa/sửa thành viên, cộng/trừ điểm theo giải đấu, xuất/nhập sao lưu dữ liệu.

---

## 🚀 2. Cách Mở & Sử Dụng Website

### Cách 1: Mở Trực Tiếp Trên Trình Duyệt (Đơn giản nhất, không cần cài đặt)
1. Truy cập thư mục dự án `doan-thuong-badminton`.
2. **Nhấp đúp chuột vào file `index.html`** để mở trang chủ Bảng Xếp Hạng.
3. Nhấp đúp chuột vào file `admin.html` để vào trang Quản trị (yêu cầu đăng nhập 1 trong 2 tài khoản admin trên).
4. Dữ liệu được lưu trữ tự động trên máy tính của bạn và tự động cập nhật giữa các tab.

### Cách 2: Chạy Bằng Máy Chủ Node.js (Để chia sẻ qua mạng LAN / Wi-Fi trường học)
1. Mở PowerShell hoặc Terminal tại thư mục `doan-thuong-badminton`.
2. Chạy lệnh:
   ```bash
   node server.js
   ```
3. Truy cập vào địa chỉ:
   - **Trang chủ**: `http://localhost:3000`
   - **Trang Admin**: `http://localhost:3000/admin.html`
4. Dữ liệu sẽ được lưu tự động vào file `database.json` trong thư mục.

---

## 🏸 3. Quy Trình Hoạt Động Của Hệ Thống

### A. Đăng Ký Thành Viên Mới
1. Bất kỳ học sinh / thành viên nào cũng có thể bấm nút **"📝 Đăng Ký"** trên thanh Menu.
2. Điền đầy đủ thông tin:
   - Họ và tên VĐV
   - Lớp (Ví dụ: `12A1`, `11A2`, `10A3`...)
   - Giới tính (Nam / Nữ)
   - Nội dung thi đấu tự chọn (`Đơn Nam`, `Đơn Nữ`, `Đôi Nam`, `Đôi Nữ`, `Đôi Nam Nữ`)
   - Tên đăng nhập & Mật khẩu
3. Sau khi bấm Gửi, hệ thống chuyển tài khoản vào trạng thái **"Chờ Admin phê duyệt"**.

### B. Admin Phê Duyệt & Đưa Vào Bảng Xếp Hạng
1. Admin đăng nhập vào hệ thống -> Mở trang `admin.html`.
2. Vào Tab **"📋 Duyệt Thành Viên Mới"**.
3. Xem thông tin người đăng ký -> Bấm **"✓ Duyệt"** -> Có thể tùy chọn nhập điểm khởi tạo (mặc định 100 điểm) -> Xác nhận.
4. Ngay lập tức, VĐV đó sẽ xuất hiện trên Bảng Xếp Hạng `index.html`.

### C. Quản Lý Điểm Số & Giải Đấu
1. Admin vào Tab **"🏅 Quản Lý Điểm Số & Giải Đấu"**.
2. Chọn VĐV cần cộng điểm.
3. Chọn mức điểm nhanh (Ví dụ: `🥇 Vô địch (+1000)`, `🥈 Á quân (+800)`, `🥉 Hạng Ba (+650)`, `🏸 Tứ kết (+450)`, `⭐ Thắng trận (+200)`, `⚔️ Thắng giao lưu (+100)`).
4. Nhập Tên giải đấu & Lý do chi tiết.
5. Bấm **"⚡ Xác Nhận & Cập Nhật Bảng Xếp Hạng"**.
6. **Bảng Xếp Hạng sẽ tự động tính toán lại và đảo thứ hạng ngay lập tức!**

### D. Tham Gia Đa Nội Dung Thi Đấu (Multi-Category)
- Mỗi thành viên có thể đăng ký tham gia **nhiều nội dung cùng lúc** (Ví dụ: vừa thi đấu `Đơn Nữ`, vừa tham gia `Đôi Nữ` và `Đôi Nam Nữ`).
- Khi người xem lọc theo bất kỳ nội dung nào mà VĐV đó tham gia, VĐV sẽ xuất hiện trên bảng xếp hạng của nội dung tương ứng.
- Thành viên có thể tự thay đổi/thêm nội dung bất cứ lúc nào trong mục **"🏸 Thành Viên Hub"** -> Tab **"Nội Dung Thi Đấu"**.

### E. Hệ Thống Kết Bạn & Nhắn Tin Trực Tiếp (Chat Messenger)
- **Kết bạn:** Thành viên có thể tìm kiếm bạn bè trong CLB để gửi lời mời kết bạn hoặc bấm nút **"➕ Kết Bạn"** khi xem hồ sơ bất kỳ ai.
- **Trò chuyện trực tuyến (Chat):** Nhắn tin 1-1 trực tiếp với bạn bè ngay trên trang web để trao đổi kinh nghiệm thi đấu, hẹn giờ tập luyện.
- **Thông báo thông minh:** Hiển thị số lượng tin nhắn chưa đọc và lời mời kết bạn mới.

### F. Mời Ghép Trận & Thách Đấu CLB
- Bấm **"⚔️ Mời Ghép Trận"** tại hồ sơ VĐV hoặc trong danh sách bạn bè.
- Chọn nội dung thi đấu, ngày giờ, sân đấu và lời nhắn thách đấu.
- Đối thủ sẽ nhận được thông báo lời mời và có thể bấm **"✓ Chấp nhận"** hoặc **"✗ Từ chối"**.

### G. Đăng Bản Tin Cầu Lông & Tải Hình Ảnh Lên Web (Dành cho Admin)
1. Admin vào Tab **"📰 Đăng Bản Tin & Ảnh"**.
2. Bấm nút **"➕ Đăng Bản Tin Mới & Tải Ảnh"**.
3. Điền các thông tin:
   - **Tiêu đề bản tin**: (Ví dụ: *Lịch thi đấu giải mùa xuân, Kết quả chung kết...*)
   - **Danh mục**: Giải Đấu, Thông Báo, Kỹ Thuật, Kết Quả, Tin Tức.
   - **Tải ảnh trực tiếp**: Bấm vào khung để chọn ảnh từ điện thoại / máy tính (hệ thống tự động tối ưu hóa và nén ảnh) hoặc dán link ảnh.
   - **Tóm tắt ngắn** & **Nội dung chi tiết**.
4. Bấm **"🚀 Đăng Lên Trang Web"**.
5. Bản tin và hình ảnh sẽ xuất hiện ngay lập tức tại mục **"📰 BẢN TIN CẦU LÔNG ĐOÀN THƯỢNG"** trên trang chủ `index.html`.

---

## 🌐 4. Hướng Dẫn Đưa Website Lên Online Miễn Phí (Cho Cả Trường Cùng Vào Xem)

Để bất kỳ học sinh, bạn bè hay thành viên nào trong trường cũng có thể mở link từ điện thoại hoặc máy tính để xem Bảng Xếp Hạng & Bản Tin do Admin cập nhật, bạn có thể đưa web lên mạng hoàn toàn miễn phí theo 1 trong 2 cách sau:

### Cách 1: Đưa lên Vercel (Khuyên dùng - Cực nhanh trong 1 phút)
1. Truy cập trang web: [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản Google / GitHub.
2. Tải hoặc kéo thả toàn bộ thư mục `doan-thuong-badminton` lên Vercel.
3. Bấm **Deploy**.
4. Bạn sẽ nhận được ngay một đường link chính thức (Ví dụ: `https://doan-thuong-badminton.vercel.app`).
5. **Gửi link này cho bạn bè, học sinh trong trường:** Bất kỳ ai vào link cũng xem được Bảng Xếp Hạng, Bản Tin, ảnh và tự đăng ký tài khoản thành viên!

### Cách 2: Đưa lên GitHub Pages (Miễn phí vĩnh viễn)
1. Tạo một tài khoản trên [GitHub.com](https://github.com).
2. Tạo một Repository mới đặt tên là `doan-thuong-badminton`.
3. Tải tất cả các file trong thư mục `doan-thuong-badminton` lên GitHub.
4. Vào **Settings** -> Mục **Pages** -> Tại mục **Branch**, chọn `main` và bấm **Save**.
5. Sau 1 phút, bạn sẽ có link: `https://tên_của_bạn.github.io/doan-thuong-badminton/`.

---

## ⚡ 5. Cơ Chế Đồng Bộ Trực Tuyến (Cloud Realtime)
- **Tự động đồng bộ:** Mỗi khi Admin **Cộng điểm**, **Duyệt thành viên** hoặc **Đăng bản tin & ảnh mới**, hệ thống sẽ tự động cập nhật lên đám mây (Cloud).
- **Mọi người xem tức thì:** Tất cả người dùng đang mở trang web trên điện thoại hoặc máy tính sẽ tự động nhảy số điểm và thấy bài viết mới mà không cần phải tải lại trang!

---

## 📁 5. Cấu Trúc Mã Nguồn

```
doan-thuong-badminton/
├── index.html        # Trang chủ & Bảng Xếp Hạng phong cách BWF
├── admin.html        # Bảng điều khiển Quản trị viên (Admin Panel)
├── styles.css        # Giao diện CSS Đỏ - Đen - Vàng thể thao BWF
├── app.js            # Xử lý CSDL, BXH, Phân quyền và Tính toán điểm
├── server.js         # Máy chủ Node.js phục vụ qua mạng LAN/Internet
├── package.json      # File cấu hình khởi động nhanh npm start
└── database.json     # CSDL lưu trữ dữ liệu (khi chạy server.js)
```

Chúc Câu Lạc Bộ Cầu Lông **Đoàn Thượng Badminton** ngày càng phát triển mạnh mẽ! 🏸🏆
