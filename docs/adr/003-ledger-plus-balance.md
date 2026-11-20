# ADR-003: Quản lý tồn kho bằng Ledger kết hợp Balance

| Trường | Giá trị |
|---|---|
| Trạng thái | Đã chấp nhận |
| Ngày | 20/11/2026 |
| Người quyết định | LacVu2004 |

## Bối cảnh

Hệ thống cần hai thứ vốn mâu thuẫn nhau:
1. **Truy vết đầy đủ** mọi biến động tồn kho: ai làm, lúc nào, tăng hay giảm bao nhiêu (OBJ-02).
2. **Đọc tồn hiện tại nhanh** cho danh sách sản phẩm và kho.

Ngoài ra, nhiều người có thể thao tác cùng lúc, và tồn kho không được âm (OBJ-01).

## Các phương án đã xem xét

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Chỉ lưu số tồn hiện tại (balance) | Đọc nhanh, đơn giản | Không có lịch sử; sai lệch thì không truy được nguyên nhân |
| Chỉ lưu ledger, tính tồn bằng cách cộng dồn | Lịch sử đầy đủ, một nguồn sự thật | Mỗi lần xem tồn phải cộng nhiều dòng, chậm khi dữ liệu lớn |
| Event sourcing đầy đủ | Rất mạnh về truy vết | Phức tạp quá mức cần thiết cho dự án này |
| **Ledger kết hợp Balance** | Lịch sử bất biến và đọc nhanh | Phải giữ hai nơi luôn khớp nhau |

## Quyết định

Dùng **Ledger kết hợp Balance**:
- `inventory_ledger_entries` là **lịch sử chính thức**, bất biến. Không bao giờ sửa hoặc xóa dòng đã ghi.
- `inventory_balances` là số liệu tổng hợp để đọc nhanh, mỗi cặp Sản phẩm + Kho một dòng.
- Mỗi thao tác nhập, xuất, điều chỉnh nằm trong **một database transaction** gồm: tạo giao dịch, tạo ledger entry, cập nhật balance, ghi audit log.
- Khi cập nhật balance, **khóa dòng bằng `SELECT ... FOR UPDATE`** theo thứ tự ổn định để tránh deadlock.
- Sửa sai bằng giao dịch đảo hoặc giao dịch điều chỉnh mới, không sửa dòng cũ.
- Có `CHECK (on_hand >= 0)` ở database làm lớp bảo vệ cuối.
- Nếu Balance và Ledger lệch nhau thì **Ledger là bên đúng**. Có truy vấn đối chiếu (reconciliation) để phát hiện lệch.

## Hệ quả

**Tích cực**
- Truy vết được từng biến động, kiểm toán được.
- Xem tồn nhanh, không cần cộng dồn.
- Chống tồn âm ở nhiều lớp: logic nghiệp vụ, khóa dòng, ràng buộc CHECK.

**Đánh đổi**
- Mọi thao tác ghi phức tạp hơn vì phải cập nhật hai nơi.
- Khóa dòng làm các yêu cầu cùng một cặp Sản phẩm + Kho phải xếp hàng chờ nhau.
- Cần test đồng thời và test đối chiếu để chứng minh tính đúng đắn.

## Khi nào xem lại

Khi lượng giao dịch tăng đến mức khóa dòng gây nghẽn, hoặc khi thêm tính năng giữ hàng (reservation) cần mô hình Reserved và Available.