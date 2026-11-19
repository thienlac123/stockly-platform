# Stockly – Product Brief

| Trường | Giá trị |
|---|---|
| Phiên bản | 1.0 |
| Trạng thái | Bản nháp cho Phase 00 |
| Ngày cập nhật | 19/11/2026 |
| Nguồn tham chiếu | Stockly Product & Engineering Blueprint v1.0 |

---

## 1. Tầm nhìn sản phẩm

Stockly là nền tảng quản lý tồn kho và vận hành kho dành cho doanh nghiệp vừa và nhỏ. Hệ thống tập trung dữ liệu sản phẩm, kho hàng và mọi biến động nhập, xuất, điều chỉnh vào một nơi, thay cho Excel hoặc sổ sách.

Khác với bảng tính, Stockly ghi lại **ai đã làm gì, vào lúc nào** cho mọi biến động tồn kho, và phân quyền theo vai trò để mỗi nhân viên chỉ làm đúng việc của mình.

Stockly là sản phẩm **nhiều doanh nghiệp dùng chung (multi-tenant)**: các doanh nghiệp cùng dùng một hệ thống nhưng dữ liệu của mỗi bên được tách biệt hoàn toàn.

## 2. Vấn đề cần giải quyết

- Số liệu tồn kho trên hệ thống khác với số hàng thực tế trên kệ.
- Không biết ai đã nhập, xuất hoặc điều chỉnh hàng, khi có sai lệch thì không truy được nguyên nhân.
- Khó phát hiện sản phẩm sắp hết để đặt thêm kịp thời.
- Doanh nghiệp có nhiều kho khó nắm tồn của từng kho.
- Mọi nhân viên đều sửa được số liệu, thiếu kiểm soát quyền hạn.

## 3. Mục tiêu sản phẩm

| Mã | Mục tiêu | Cách kiểm chứng |
|---|---|---|
| OBJ-01 | Tồn kho luôn nhất quán | Test gửi nhiều yêu cầu xuất kho cùng lúc; tồn kho không bao giờ âm |
| OBJ-02 | Truy vết được mọi biến động | Mỗi giao dịch đã ghi sổ đều có bút toán ledger và người thực hiện |
| OBJ-03 | Hỗ trợ nhiều kho | Tồn kho được theo dõi riêng theo từng cặp Sản phẩm + Kho |
| OBJ-04 | Cách ly dữ liệu giữa các doanh nghiệp | Test đăng nhập tổ chức A, thử truy cập dữ liệu tổ chức B qua API; kết quả phải bị từ chối |
| OBJ-05 | Hỗ trợ quy trình kho hằng ngày | Thực hiện được trọn vẹn luồng nhập, xuất, điều chỉnh và xem lịch sử |

Các mục tiêu trên là mục tiêu thiết kế, không phải kết quả đã đạt được. Mỗi mục phải được chứng minh bằng kiểm thử.

## 4. Người dùng mục tiêu

| Vai trò | Làm gì | Release 1 |
|---|---|---|
| Owner | Chủ doanh nghiệp, quản lý thành viên và cấu hình tổ chức | Có |
| Admin | Quản lý người dùng, sản phẩm và kho | Có |
| Warehouse Manager | Giám sát nhập, xuất và điều chỉnh tồn kho | Có |
| Warehouse Staff | Thực hiện thao tác nhập và xuất kho | Có |
| Purchasing Staff | Quản lý nhà cung cấp và đơn mua hàng | Release 2 |
| Sales Staff | Tra cứu sản phẩm và tồn kho | Release 2 |
| Platform Admin | Vận hành nền tảng SaaS | Hoãn lại |

## 5. Phạm vi theo release

Blueprint dự tính 12 tuần làm việc toàn thời gian. Với dự án cá nhân làm ngoài giờ, phạm vi được chia thành các release. Mỗi release phải chạy được và trình bày được độc lập.

### Release 1 – Làm ngay (Core Inventory)

Luồng chính cần chạy trọn vẹn: **tạo tổ chức → thêm sản phẩm và kho → nhập kho → xuất kho → xem tồn và lịch sử**.

| Nhóm | Nội dung |
|---|---|
| Xác thực | Đăng ký, đăng nhập, đăng xuất, refresh token rotation, giới hạn đăng nhập sai |
| Tổ chức | Tạo Organization, tham gia nhiều tổ chức, chuyển tổ chức, thêm thành viên |
| Phân quyền | RBAC với 4 vai trò (Owner, Admin, Warehouse Manager, Warehouse Staff); cách ly dữ liệu theo tenant |
| Sản phẩm | Tạo, xem, sửa, lưu trữ (archive) sản phẩm; SKU, danh mục, đơn vị tính, ngưỡng cảnh báo; tìm kiếm, lọc, sắp xếp, phân trang |
| Kho | Tạo và cập nhật kho; xem tồn theo kho |
| Tồn kho | Nhập kho, xuất kho, điều chỉnh; Inventory Balance; Ledger bất biến; lịch sử giao dịch |
| Nền tảng | Audit log cho thao tác quan trọng, health check, tài liệu API (Swagger), CI |

### Release 2 – Làm sau khi Release 1 xong

- Nhà cung cấp và Purchase Order, nhận hàng từng phần.
- Chuyển kho giữa các kho (yêu cầu, xuất, đang vận chuyển, nhận hàng).
- Kiểm kê (stocktake) và xử lý chênh lệch.
- Dashboard, báo cáo nhập xuất, xuất CSV.
- Thông báo và cảnh báo tồn kho thấp.
- Quên và đặt lại mật khẩu (cần gửi email).
- Vai trò Purchasing Staff và Sales Staff.
- Vị trí lưu trữ bên trong kho, barcode.

*Lý do:* các mục này mở rộng luồng chính nhưng không bắt buộc để luồng nhập, xuất, xem tồn hoạt động.

### Hoãn lại – Chỉ làm nếu có nhu cầu thật

- Redis (cache, rate limit) và BullMQ (xử lý nền).
- Lưu trữ hình ảnh bằng S3.
- Outbox pattern.
- Giao diện Platform Admin.
- Giữ hàng (reservation).
- Hệ thống giám sát đầy đủ.

*Lý do:* thêm hạ tầng phức tạp, tốn thời gian, và blueprint cũng nêu over-engineering là rủi ro cao. Chỉ thêm khi có use case chứng minh được.

## 6. Ngoài phạm vi (Out of Scope)

- Kế toán tổng hợp, tính lương, quản lý nhân sự.
- CRM chuyên sâu và ERP tích hợp đầy đủ.
- Ứng dụng mobile native.
- AI dự báo nhu cầu nhập hàng.
- Thanh toán thương mại thực tế và subscription billing.
- Tích hợp với hệ thống ERP bên ngoài.

## 7. Ràng buộc nghiệp vụ và kỹ thuật

- **SKU là duy nhất trong cùng một tổ chức**, vì hai doanh nghiệp khác nhau có thể dùng cùng một mã SKU mà không ảnh hưởng nhau.
- **Mọi dữ liệu nghiệp vụ phải có khóa tenant (`organization_id`)**, vì đó là cơ sở để cách ly dữ liệu giữa các doanh nghiệp.
- **Tiền và số lượng thập phân dùng kiểu Decimal/Numeric, không dùng số thực**, vì số thực làm tròn sai và gây lệch tiền.
- **Mọi thao tác thay đổi tồn kho nằm trong một database transaction**, vì nếu lỗi giữa chừng thì phải hủy toàn bộ, không để dữ liệu dở dang.
- **Giao dịch đã ghi sổ (POSTED) không được sửa trực tiếp**; muốn sửa phải tạo giao dịch đảo (reversal) hoặc giao dịch mới, vì lịch sử phải đáng tin để truy vết.
- **Ledger là lịch sử chính thức; Inventory Balance chỉ là số liệu tổng hợp để truy vấn nhanh**, vì nếu hai bên lệch nhau thì Ledger là bên đúng.
- **Tồn kho không âm theo chính sách mặc định**, vì xuất nhiều hơn số hàng đang có là sai nghiệp vụ.
- **Sản phẩm đã có giao dịch không được xóa cứng**, chỉ được lưu trữ (archive), vì xóa sẽ làm mất ý nghĩa của lịch sử giao dịch.
- **Thời gian lưu theo UTC, hiển thị theo múi giờ của tổ chức**, vì tránh sai lệch khi tổ chức ở nhiều múi giờ.
- **PostgreSQL là nguồn dữ liệu chính**, vì cần giao dịch ACID và ràng buộc quan hệ.

## 8. Tiêu chí hoàn thành Release 1

1. Người dùng đăng ký, tạo tổ chức và đăng nhập thành công.
2. Người dùng của tổ chức A không đọc hay sửa được dữ liệu của tổ chức B, có test chứng minh.
3. Quản lý được sản phẩm và kho, có tìm kiếm và phân trang.
4. Nhập kho, xuất kho và điều chỉnh tạo ra bút toán ledger và cập nhật Inventory Balance đúng.
5. Khi nhiều yêu cầu xuất kho gửi cùng lúc, tồn kho không bị âm, có test chứng minh.
6. Mỗi biến động tồn kho hiển thị được ai thực hiện và vào lúc nào.
7. Vai trò Warehouse Staff không thực hiện được thao tác ngoài quyền (ví dụ quản lý thành viên).
8. API có tài liệu Swagger, CI chạy xanh, README hướng dẫn chạy dự án, có tài khoản demo và dữ liệu mẫu.

## 9. Rủi ro chính

| Rủi ro | Mức ảnh hưởng | Cách giảm thiểu |
|---|---|---|
| Rò rỉ dữ liệu giữa các tổ chức | Rất cao | Bắt buộc có tenant context, ràng buộc unique kèm `organization_id`, viết test cách ly |
| Nhiều người cập nhật tồn kho cùng lúc | Rất cao | Dùng transaction, khóa dòng (row lock) và viết test đồng thời |
| Ledger và Balance lệch nhau | Cao | Ghi cả hai trong cùng một transaction, ledger bất biến |
| Làm quá nhiều thứ (over-engineering, scope creep) | Cao | Chia release, giữ danh sách "Hoãn lại" và "Ngoài phạm vi" |
| Lộ bí mật (mật khẩu DB, key) | Cao | Dùng `.env` không đưa lên Git, có `.env.example` |
| Hết thời gian hoặc mất động lực | Cao | Mỗi release chạy và trình bày được độc lập; làm theo từng phase nhỏ |