# ADR-004: Xác thực bằng access token ngắn hạn và refresh token xoay vòng

| Trường | Giá trị |
|---|---|
| Trạng thái | Đã chấp nhận (chi tiết thời hạn và cách lưu trữ chốt ở Phase 02) |
| Ngày | 20/11/2026 |
| Người quyết định | LacVu2004 |

## Bối cảnh

Người dùng cần đăng nhập và giữ phiên một cách an toàn. Hệ thống cần có khả năng thu hồi phiên (đăng xuất, nghi ngờ bị lộ token) và hạn chế thiệt hại nếu một token bị đánh cắp.

## Các phương án đã xem xét

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Session server-side truyền thống | Thu hồi dễ | Phải lưu và tra cứu phiên ở mọi request; khó scale hơn |
| Một JWT dài hạn | Đơn giản | Bị đánh cắp là dùng được đến khi hết hạn, không thu hồi được |
| **Access token ngắn hạn + refresh token xoay vòng** | Token truy cập tồn tại ngắn; phiên thu hồi được; phát hiện được token bị dùng lại | Phức tạp hơn khi cài đặt |

## Quyết định

Dùng **access token ngắn hạn kèm refresh token rotation**:
- **Access token** có thời hạn ngắn (dự kiến vài phút đến khoảng 15 phút), dùng cho mỗi request API.
- **Refresh token** dài hạn hơn, chỉ dùng để xin cặp token mới.
- **Rotation:** mỗi lần làm mới, refresh token cũ bị thay thế bằng token mới.
- **Reuse detection:** nếu một refresh token đã bị thay thế mà vẫn được gửi lại, coi là dấu hiệu bị đánh cắp và thu hồi toàn bộ phiên liên quan.
- Refresh token lưu trong database dưới dạng **hash**, hỗ trợ thu hồi (`revoked_at`).
- Mật khẩu hash bằng **Argon2id** (hoặc bcrypt với cost phù hợp).
- Phía trình duyệt: ưu tiên refresh token trong cookie **HttpOnly, Secure, SameSite**, có bảo vệ CSRF cho endpoint làm mới; access token giữ trong bộ nhớ, **không lưu trong localStorage**.
- Giới hạn tần suất (rate limit) cho đăng nhập và các endpoint nhạy cảm.

## Hệ quả

**Tích cực**
- Token bị lộ chỉ dùng được trong thời gian ngắn.
- Đăng xuất và thu hồi phiên có hiệu lực thật sự.
- Phát hiện được việc dùng lại refresh token đã bị thay thế.

**Đánh đổi**
- Phải xử lý làm mới token ở frontend, kể cả khi nhiều request chạy song song.
- Cookie xuyên tên miền (frontend và backend khác domain) cần cấu hình `SameSite`, CORS và CSRF cẩn thận.
- Cần bảng `refresh_tokens` và logic dọn token hết hạn.

## Khi nào xem lại

- Khi chốt cách triển khai ở Phase 08: nếu frontend và backend khác domain thì cần xem lại cách gửi cookie.
- Khi thêm đăng nhập bằng bên thứ ba (Google...) hoặc đăng nhập nhiều thiết bị với quản lý phiên chi tiết.