# ADR-001: Chọn kiến trúc Modular Monolith

| Trường | Giá trị |
|---|---|
| Trạng thái | Đã chấp nhận |
| Ngày | 20/11/2026 |
| Người quyết định | LacVu2004 |

## Bối cảnh

Stockly gồm nhiều miền nghiệp vụ: xác thực, tổ chức, sản phẩm, kho, tồn kho, và sau này là mua hàng, chuyển kho, báo cáo. Dự án do một người phát triển ngoài giờ, nên chi phí vận hành và độ phức tạp phải thấp.

Điểm khó nhất của hệ thống là **tính nhất quán của tồn kho**: một thao tác xuất kho phải cập nhật giao dịch, ledger, balance và audit log trong cùng một transaction.

## Các phương án đã xem xét

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Microservices | Mở rộng và triển khai độc lập từng phần | Giao dịch phân tán rất phức tạp, tốn công vận hành, quá sức với một người |
| Monolith thường (không tách module) | Nhanh lúc đầu | Code dần rối, khó tách hoặc kiểm thử riêng từng miền |
| **Modular Monolith** | Một ứng dụng, một database, transaction đơn giản; vẫn có ranh giới module rõ ràng | Phải tự giữ kỷ luật ranh giới giữa các module |

## Quyết định

Dùng **Modular Monolith** với NestJS. Toàn bộ backend là một ứng dụng triển khai chung, chia thành các module theo miền nghiệp vụ (auth, organizations, products, warehouses, inventory...).

Quy tắc giữ ranh giới:
- Mỗi module sở hữu bảng dữ liệu và logic của riêng mình.
- Module khác chỉ truy cập qua service được module đó công khai (export), không truy vấn thẳng vào bảng của module khác.
- Không có phụ thuộc vòng giữa các module.

## Hệ quả

**Tích cực**
- Một database transaction bao được toàn bộ luồng ghi tồn kho.
- Triển khai và debug đơn giản, phù hợp một người.
- Ranh giới module sẵn sàng để tách thành service nếu thật sự cần.

**Đánh đổi**
- Không scale riêng từng module được.
- Ranh giới module chỉ được bảo vệ bằng quy ước và code review, không có hàng rào cứng.

## Khi nào xem lại

Khi có bằng chứng cụ thể về nhu cầu scale riêng một module, hoặc nhiều nhóm cần làm việc và triển khai độc lập.