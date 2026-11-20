# ADR-002: Đa tenant bằng shared database, shared schema

| Trường | Giá trị |
|---|---|
| Trạng thái | Đã chấp nhận |
| Ngày | 20/11/2026 |
| Người quyết định | LacVu2004 |

## Bối cảnh

Stockly phục vụ nhiều doanh nghiệp (tổ chức) trên cùng một hệ thống. Dữ liệu của tổ chức này tuyệt đối không được lộ sang tổ chức khác (mục tiêu OBJ-04). Cần chọn mô hình lưu dữ liệu đa tenant.

## Các phương án đã xem xét

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Mỗi tenant một database | Cách ly mạnh nhất | Rất tốn vận hành: nhiều database, migration chạy nhiều lần, khó quản lý |
| Mỗi tenant một schema | Cách ly khá tốt | Migration phải áp dụng cho từng schema, phức tạp khi số tenant tăng |
| **Một database, một schema, cột `organization_id`** | Đơn giản vận hành, một lần migration, dễ truy vấn chung | Cách ly phụ thuộc hoàn toàn vào việc code lọc đúng tenant |

## Quyết định

Dùng **một database và một schema chung**. Mọi bảng nghiệp vụ có cột `organization_id`.

Các biện pháp bắt buộc để cách ly dữ liệu:
- Mỗi request phải xác định được **tenant context** từ membership của người dùng, không tin Organization ID do client tự gửi.
- Mọi truy vấn nghiệp vụ đều lọc theo `organization_id`.
- Các ràng buộc unique luôn kèm tenant, ví dụ `UNIQUE(organization_id, sku)`.
- Ngăn liên kết chéo tổ chức bằng khóa ngoại kép hoặc cơ chế tương đương (cách chọn sẽ chốt ở Phase 02–03).
- Có test tự động thử truy cập dữ liệu tổ chức khác trên mọi endpoint có tham số ID.

## Hệ quả

**Tích cực**
- Vận hành đơn giản, chi phí thấp, phù hợp MVP và portfolio.
- Migration chỉ chạy một lần cho toàn hệ thống.

**Đánh đổi**
- Một lỗi quên lọc `organization_id` có thể gây rò rỉ dữ liệu, đây là rủi ro mức cao nhất của dự án.
- Một tenant dùng nhiều tài nguyên có thể ảnh hưởng tenant khác (noisy neighbor).

## Khi nào xem lại

- Khi cần thêm một lớp bảo vệ ở tầng database: cân nhắc **PostgreSQL Row-Level Security**.
- Khi có khách hàng yêu cầu cách ly dữ liệu vật lý, hoặc quy mô tăng đến mức cần tách database.