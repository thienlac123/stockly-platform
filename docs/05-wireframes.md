# Stockly – Wireframes (Release 1)

| Trường | Giá trị |
|---|---|
| Phiên bản | 1.0 |
| Ngày cập nhật | 20/11/2026 |
| Tài liệu liên quan | [User Stories](02-user-stories.md) |

Wireframe thể hiện bố cục và nội dung, chưa phải thiết kế giao diện cuối cùng. Ba màn hình dưới đây phục vụ luồng chính: đăng nhập, xem sản phẩm, nhập kho.

## 1. Đăng nhập (US-AUTH-02)

```
+------------------------------------------------+
|                    STOCKLY                     |
|             Sign in to your account            |
|                                                |
|   Email     [______________________________]   |
|             (lỗi hiển thị tại đây)             |
|   Password  [______________________________]   |
|                                                |
|   [             Sign in               ]        |
|                                                |
|   Don't have an account? Register             |
+------------------------------------------------+
```

**Trạng thái cần có:** đang gửi (nút bị vô hiệu, hiện "Signing in..."), sai thông tin (thông báo chung, không nói email có tồn tại hay không), bị giới hạn đăng nhập sai (hiện thời gian chờ).

## 2. Danh sách sản phẩm (US-PRD-02)

```
+----------+-------------------------------------------------+
| STOCKLY  |  [Acme Store v]                  [User menu v]  |
|          +-------------------------------------------------+
| Overview |  Products                      [ + New product ]|
| Products |                                                 |
| Warehouses| [Search name or SKU______] [Category v] [Status v]|
| Stock    |                                                 |
| History  |  SKU       Name            Category   Status    |
| Members  |  ------------------------------------------   |
| Audit log|  TS-001    Cotton T-shirt  Fashion    Active   |
|          |  FS-014    Face serum      Cosmetics  Active   |
|          |  UC-220    USB-C cable     Electronics Archived|
|          |  ------------------------------------------   |
|          |  Showing 1-20 of 148        [<] 1 2 3 ... [>]  |
+----------+-------------------------------------------------+
```

**Ghi chú:**
- Ô chọn tổ chức ở góc trên dùng cho việc chuyển tổ chức (US-ORG-02).
- Nút "New product" chỉ hiện với Owner và Admin (US-SEC-01).
- Menu "Members" và "Audit log" chỉ hiện với Owner và Admin.

**Trạng thái cần có:** đang tải (skeleton), danh sách rỗng ("No products yet" kèm nút tạo mới), lỗi tải (có nút thử lại), không có kết quả tìm kiếm.

## 3. Phiếu nhập kho (US-INV-01)

```
+----------+-------------------------------------------------+
| STOCKLY  |  Receive stock                                  |
|          |                                                 |
| (sidebar)|  Warehouse     [Main warehouse            v]    |
|          |  Reference     [Số chứng từ / ghi chú_______]   |
|          |                                                 |
|          |  Product              Quantity                  |
|          |  [Cotton T-shirt  v]  [ 100 ]        [x]        |
|          |  [Face serum      v]  [  50 ]        [x]        |
|          |  [ + Add line ]                                 |
|          |                                                 |
|          |  [ Cancel ]                  [ Post receipt ]   |
+----------+-------------------------------------------------+
```

**Quy tắc kiểm tra tại form:** phải chọn kho; mỗi dòng phải có sản phẩm; số lượng lớn hơn 0; không chọn sản phẩm hoặc kho đã lưu trữ.

**Trạng thái cần có:** đang gửi (khóa nút để tránh bấm hai lần, kèm khóa idempotency, US-INV-04), thành công (chuyển sang chi tiết giao dịch), lỗi từ server (hiện thông báo, giữ nguyên dữ liệu đã nhập).