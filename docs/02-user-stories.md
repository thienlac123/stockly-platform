# Stockly – User Stories (Release 1)

| Trường | Giá trị |
|---|---|
| Phiên bản | 1.0 |
| Trạng thái | Bản nháp cho Phase 00 |
| Ngày cập nhật | 19/11/2026 |
| Tài liệu liên quan | [Product Brief](01-product-brief.md) |

## Cách đọc tài liệu

**Mẫu viết story:** *Là [vai trò], tôi muốn [việc cần làm], để [lợi ích].*

**Tiêu chí nghiệm thu (Acceptance Criteria – AC)** là các điều kiện kiểm tra được. Story chỉ được coi là xong khi mọi AC đều đạt. Với các luồng quan trọng, AC viết theo dạng **Cho / Khi / Thì**.

**Mã story:** `US-<nhóm>-<số>`. **Tham chiếu:** `BR-xxx` là Business Rule, `UC-xx` là Use Case, `FR-xx` là Functional Requirement trong blueprint.

**Độ ưu tiên:** tất cả story trong tài liệu này thuộc Release 1. Mức **P0** là bắt buộc để luồng chính chạy được, **P1** là nên có.

**Luồng chính của Release 1:** tạo tổ chức → thêm sản phẩm và kho → nhập kho → xuất kho → xem tồn và lịch sử.

## Danh sách epic

| Epic | Nhóm | Số story |
|---|---|---|
| E1 | Xác thực (AUTH) | 5 |
| E2 | Tổ chức và thành viên (ORG) | 4 |
| E3 | Phân quyền và cách ly dữ liệu (SEC) | 2 |
| E4 | Sản phẩm (PRD) | 5 |
| E5 | Kho (WH) | 3 |
| E6 | Tồn kho (INV) | 6 |
| E7 | Nhật ký hoạt động (AUD) | 1 |

---

## E1. Xác thực (AUTH)

### US-AUTH-01 – Đăng ký tài khoản · P0
Là khách, tôi muốn đăng ký tài khoản bằng email và mật khẩu, để bắt đầu dùng Stockly.

- Đăng ký thành công khi email đúng định dạng, chưa được dùng và mật khẩu đủ mạnh (tối thiểu 8 ký tự).
- Email đã tồn tại thì báo lỗi rõ ràng và không tạo tài khoản mới.
- Mật khẩu được lưu dưới dạng hash, không bao giờ lưu hay ghi log dạng thô.
- Lỗi validation hiển thị cạnh trường tương ứng.

*Tham chiếu: UC-01, FR-01.01*

### US-AUTH-02 – Đăng nhập · P0
Là người dùng, tôi muốn đăng nhập bằng email và mật khẩu, để truy cập dữ liệu của tổ chức mình.

- Thông tin đúng thì nhận được phiên đăng nhập hợp lệ.
- Thông tin sai thì báo lỗi chung ("Email hoặc mật khẩu không đúng"), không tiết lộ email có tồn tại hay không.
- Tài khoản bị vô hiệu hóa không đăng nhập được.

*Tham chiếu: UC-02, FR-01.02, FR-01.06*

### US-AUTH-03 – Duy trì phiên và làm mới token · P0
Là người dùng, tôi muốn phiên đăng nhập được duy trì an toàn, để không phải đăng nhập lại liên tục.

- Access token có thời hạn ngắn; refresh token dùng để cấp token mới.
- Mỗi lần làm mới, refresh token cũ bị thay thế (rotation) và không dùng lại được.
- Dùng lại một refresh token đã bị thay thế thì bị từ chối và phiên liên quan bị thu hồi.
- Refresh token được lưu dạng hash ở server.

*Tham chiếu: FR-01.04, mục 8.1*

### US-AUTH-04 – Đăng xuất · P0
Là người dùng, tôi muốn đăng xuất, để người khác không dùng tiếp phiên của tôi.

- Đăng xuất thu hồi refresh token hiện tại.
- Sau khi đăng xuất, refresh token cũ không còn dùng được.

*Tham chiếu: FR-01.03*

### US-AUTH-05 – Giới hạn đăng nhập sai · P1
Là chủ tài khoản, tôi muốn hệ thống chặn việc đoán mật khẩu liên tục, để tài khoản khó bị tấn công.

- Quá số lần đăng nhập sai cho phép trong một khoảng thời gian thì tạm khóa thử tiếp.
- Thông báo cho người dùng biết cần chờ bao lâu.
- Hết thời gian chờ thì đăng nhập lại được bình thường.

*Tham chiếu: FR-01.07*

---

## E2. Tổ chức và thành viên (ORG)

### US-ORG-01 – Tạo tổ chức · P0
Là người dùng mới, tôi muốn tạo một tổ chức (Organization) cho doanh nghiệp của mình, để có không gian làm việc riêng.

- Tổ chức có tên và slug duy nhất toàn hệ thống.
- Người tạo tự động trở thành **Owner** của tổ chức.
- Tạo tổ chức thành công thì có thể dùng ngay các chức năng theo quyền Owner.

*Tham chiếu: UC-03, FR-02.01, FR-02.02*

### US-ORG-02 – Chuyển đổi tổ chức · P1
Là người dùng thuộc nhiều tổ chức, tôi muốn chuyển giữa các tổ chức, để làm việc với từng doanh nghiệp.

- Người dùng thấy danh sách tổ chức mình có membership hợp lệ.
- Chuyển tổ chức thì mọi dữ liệu hiển thị chuyển theo tổ chức mới.
- Không chuyển được sang tổ chức mà người dùng không phải thành viên.

*Tham chiếu: FR-02.03, FR-02.04, BR-028*

### US-ORG-03 – Thêm thành viên · P0
Là Owner hoặc Admin, tôi muốn thêm người khác vào tổ chức, để họ cùng làm việc.

- Có thể thêm người bằng email (Release 1 không gửi email mời, xem Product Brief).
- Khi thêm phải chọn vai trò cho thành viên.
- Admin không gán được vai trò Owner.
- Người không có quyền quản lý thành viên không thấy và không gọi được chức năng này.

*Tham chiếu: UC-04, FR-02.06*

### US-ORG-04 – Đổi vai trò và gỡ thành viên · P1
Là Owner hoặc Admin, tôi muốn đổi vai trò hoặc gỡ một thành viên, để kiểm soát quyền truy cập.

- Đổi vai trò có hiệu lực ngay ở lần gọi API tiếp theo của thành viên đó.
- Gỡ thành viên thì họ mất quyền truy cập tổ chức nhưng lịch sử giao dịch của họ vẫn giữ nguyên.
- Tổ chức luôn còn ít nhất một Owner; không gỡ hoặc hạ quyền Owner cuối cùng.
- Mỗi thay đổi vai trò được ghi vào audit log.

*Tham chiếu: UC-05*

---

## E3. Phân quyền và cách ly dữ liệu (SEC)

### US-SEC-01 – Phân quyền theo vai trò (RBAC) · P0
Là chủ doanh nghiệp, tôi muốn mỗi nhân viên chỉ làm được việc đúng vai trò, để hạn chế sai sót và lạm quyền.

- Mỗi thao tác nghiệp vụ yêu cầu một permission cụ thể (xem bảng ma trận quyền ở cuối tài liệu).
- Người không đủ quyền nhận phản hồi từ chối (403) và thao tác không được thực hiện.
- Giao diện ẩn hoặc vô hiệu hóa chức năng người dùng không có quyền, nhưng **server luôn tự kiểm tra** quyền, không tin giao diện.
- Có test cho từng vai trò với các thao tác chính.

*Tham chiếu: FR-02, mục 8.2*

### US-SEC-02 – Cách ly dữ liệu giữa các tổ chức · P0
Là chủ doanh nghiệp, tôi muốn dữ liệu của mình không bao giờ bị doanh nghiệp khác nhìn thấy, để yên tâm dùng chung nền tảng.

- **Cho** người dùng A thuộc tổ chức X, **khi** gọi API đọc sản phẩm bằng ID của sản phẩm thuộc tổ chức Y, **thì** nhận kết quả không tìm thấy hoặc bị từ chối, không lộ bất kỳ dữ liệu nào.
- Điều tương tự đúng cho sửa, xóa, kho, giao dịch tồn kho, ledger và audit log.
- Hệ thống không tin Organization ID do giao diện gửi lên nếu chưa kiểm tra membership của người dùng.
- Không thể tạo liên kết chéo tổ chức (ví dụ giao dịch của tổ chức X dùng kho của tổ chức Y).
- Có test tự động thử đổi ID tài nguyên trên mọi endpoint có tham số ID.

*Tham chiếu: OBJ-04, BR-027, BR-028, BR-029, BR-030, mục 8.3*

---

## E4. Sản phẩm (PRD)

### US-PRD-01 – Tạo sản phẩm · P0
Là Admin, tôi muốn thêm sản phẩm vào danh mục, để có thứ để quản lý tồn kho.

- Thông tin gồm: tên, SKU, danh mục, đơn vị tính, giá nhập tham khảo, giá bán tham khảo, ngưỡng cảnh báo tồn thấp.
- SKU là bắt buộc và duy nhất trong cùng tổ chức; trùng SKU thì báo lỗi. Hai tổ chức khác nhau được dùng cùng SKU.
- Giá không âm và lưu dạng Decimal.
- Sản phẩm mới tạo ở trạng thái hoạt động (active).

*Tham chiếu: UC-06, FR-03.01, BR-001, BR-002, BR-005*

### US-PRD-02 – Xem, tìm kiếm và lọc danh sách sản phẩm · P0
Là người dùng có quyền xem, tôi muốn tìm nhanh sản phẩm, để không phải cuộn cả danh sách dài.

- Tìm theo tên hoặc SKU.
- Lọc theo danh mục và trạng thái; sắp xếp theo tên hoặc ngày tạo.
- Danh sách được phân trang và cho biết tổng số kết quả.
- Chỉ hiển thị sản phẩm của tổ chức hiện tại.
- Có trạng thái rỗng và trạng thái đang tải rõ ràng.

*Tham chiếu: FR-03.03*

### US-PRD-03 – Cập nhật sản phẩm · P0
Là Admin, tôi muốn sửa thông tin sản phẩm, để dữ liệu luôn đúng.

- Sửa được tên, danh mục, đơn vị, giá, ngưỡng cảnh báo.
- Đổi SKU sang giá trị đã tồn tại trong tổ chức thì bị từ chối.
- Thay đổi được ghi vào audit log.

*Tham chiếu: FR-03.01, FR-03.04*

### US-PRD-04 – Lưu trữ (archive) sản phẩm · P0
Là Admin, tôi muốn ngừng dùng một sản phẩm mà không làm mất lịch sử, để danh mục gọn nhưng số liệu cũ vẫn đúng.

- Sản phẩm đã có giao dịch **không bị xóa cứng**, chỉ chuyển sang trạng thái lưu trữ.
- Sản phẩm đã lưu trữ không được dùng cho giao dịch mới.
- Sản phẩm đã lưu trữ vẫn hiện trong lịch sử giao dịch cũ.
- Có thể kích hoạt lại sản phẩm đã lưu trữ.

*Tham chiếu: FR-03.05, BR-003, BR-004*

### US-PRD-05 – Quản lý danh mục và đơn vị tính · P1
Là Admin, tôi muốn tạo và sửa danh mục và đơn vị tính, để phân loại sản phẩm gọn gàng.

- Tạo, sửa, xem danh sách danh mục và đơn vị tính của tổ chức.
- Tên danh mục và đơn vị là duy nhất trong tổ chức.
- Không xóa danh mục hoặc đơn vị đang được sản phẩm sử dụng.

*Tham chiếu: FR-03.02*

---

## E5. Kho (WH)

### US-WH-01 – Tạo kho · P0
Là Admin hoặc Warehouse Manager, tôi muốn tạo kho, để có nơi lưu hàng.

- Kho có tên, mã kho (duy nhất trong tổ chức) và địa chỉ (không bắt buộc).
- Kho mới tạo ở trạng thái hoạt động.
- Tổ chức có thể có nhiều kho.

*Tham chiếu: UC-07, FR-04.01, OBJ-03*

### US-WH-02 – Cập nhật và lưu trữ kho · P1
Là Admin hoặc Warehouse Manager, tôi muốn sửa thông tin hoặc ngừng dùng một kho, để dữ liệu phản ánh thực tế.

- Sửa được tên, địa chỉ.
- **Cho** kho còn hàng tồn, **khi** thử lưu trữ kho, **thì** bị từ chối kèm lý do.
- Kho đã lưu trữ không được chọn cho giao dịch mới.

*Tham chiếu: FR-04.04*

### US-WH-03 – Xem tồn kho theo kho · P0
Là người dùng có quyền xem tồn, tôi muốn xem một kho đang chứa gì, để biết hàng ở đâu.

- Hiển thị danh sách sản phẩm trong kho kèm số lượng On Hand.
- Có tìm kiếm theo tên hoặc SKU và phân trang.
- Sản phẩm có số lượng thấp hơn hoặc bằng ngưỡng cảnh báo được đánh dấu rõ.

*Tham chiếu: FR-04.03, FR-05.08*

---

## E6. Tồn kho (INV)

> Đây là epic cốt lõi và có rủi ro dữ liệu cao nhất. Mọi story đều tuân thủ: số lượng lớn hơn 0 (BR-010), ghi trong một database transaction (BR-009), có ledger entry (BR-007), ghi người thực hiện và thời điểm (BR-011).

### US-INV-01 – Nhập kho · P0
Là Warehouse Staff, tôi muốn ghi nhận hàng vừa nhập vào kho, để tồn kho tăng đúng với thực tế.

- **Cho** người dùng có quyền nhận hàng, kho và sản phẩm đang hoạt động, **khi** gửi phiếu nhập với số lượng lớn hơn 0, **thì** hệ thống tạo giao dịch, bút toán ledger và tăng Inventory Balance của cặp Sản phẩm + Kho.
- Có thể nhập nhiều sản phẩm trong cùng một phiếu; nếu một dòng lỗi thì **cả phiếu bị hủy**, không có dữ liệu ghi dở.
- Số lượng bằng 0 hoặc âm bị từ chối.
- Sản phẩm hoặc kho đã lưu trữ bị từ chối.
- Phiếu nhập có mã giao dịch duy nhất, và có thể ghi chú tham chiếu (số chứng từ).
- Hoàn tất thì ghi audit log.

*Tham chiếu: UC-08, FR-05.01, BR-004, BR-007, BR-009, BR-010*

### US-INV-02 – Xuất kho · P0
Là Warehouse Staff, tôi muốn ghi nhận hàng xuất khỏi kho, để tồn kho giảm đúng.

- **Cho** kho còn đủ hàng, **khi** xuất số lượng nhỏ hơn hoặc bằng tồn, **thì** tạo giao dịch, ledger và giảm Balance.
- **Cho** tồn hiện tại là 10, **khi** yêu cầu xuất 11, **thì** bị từ chối với lý do không đủ hàng và không có thay đổi nào được ghi.
- **Cho** tồn là 10, **khi** hai người cùng lúc xuất 8, **thì** chỉ một yêu cầu thành công, yêu cầu còn lại bị từ chối, và tồn cuối cùng không âm. *(Phải có test tự động cho trường hợp này.)*
- Nhiều dòng trong một phiếu: một dòng không đủ hàng thì cả phiếu bị hủy.

*Tham chiếu: UC-09, FR-05.02, OBJ-01, BR-006, BR-009*

### US-INV-03 – Điều chỉnh tồn kho · P0
Là Warehouse Manager, tôi muốn điều chỉnh tồn khi số thực tế khác hệ thống, để số liệu khớp mà vẫn truy vết được.

- Chọn kho, sản phẩm và số lượng thay đổi (tăng hoặc giảm), **bắt buộc nhập lý do**.
- Điều chỉnh tạo giao dịch và bút toán ledger mới; **không sửa hoặc xóa** bút toán cũ.
- Điều chỉnh giảm không được làm tồn âm.
- Chỉ người có quyền điều chỉnh mới thực hiện được (Warehouse Staff không có quyền này).
- Hoàn tất thì ghi audit log kèm lý do.

*Tham chiếu: FR-05.03, BR-006, BR-008, BR-014*

### US-INV-04 – Chống gửi trùng giao dịch (idempotency) · P1
Là người dùng, tôi muốn việc bấm gửi nhiều lần hoặc mạng chập chờn không tạo giao dịch trùng, để tồn kho không bị tính hai lần.

- Mỗi yêu cầu ghi sổ kèm một khóa idempotency do client tạo.
- Gửi lại cùng khóa với cùng nội dung thì trả về kết quả của lần đầu, không tạo giao dịch mới.
- Gửi lại cùng khóa nhưng nội dung khác thì báo xung đột.
- Có test: gửi cùng một yêu cầu hai lần, tồn chỉ thay đổi một lần.

*Tham chiếu: BR-012, UC-08*

### US-INV-05 – Xem tồn kho tổng hợp · P0
Là người dùng có quyền xem tồn, tôi muốn xem tồn của một sản phẩm ở tất cả các kho, để biết tổng hàng đang có.

- Hiển thị On Hand theo từng kho và tổng cộng.
- Lọc theo kho và theo sản phẩm; tìm kiếm; phân trang.
- Số liệu Balance luôn khớp tổng các bút toán ledger của cặp Sản phẩm + Kho (có test đối chiếu).

*Tham chiếu: FR-05.07, OBJ-02, BR-013*

*Ghi chú:* Release 1 chỉ hiển thị **On Hand**. Reserved và Available thuộc phần giữ hàng (reservation) đã hoãn lại.

### US-INV-06 – Xem lịch sử giao dịch và ledger · P0
Là Warehouse Manager, tôi muốn xem ai đã nhập, xuất, điều chỉnh gì và khi nào, để truy được nguyên nhân khi có sai lệch.

- Danh sách giao dịch hiển thị: mã, loại (nhập, xuất, điều chỉnh), kho, người thực hiện, thời điểm, trạng thái.
- Mở một giao dịch thấy chi tiết từng dòng sản phẩm và số lượng.
- Lọc theo loại giao dịch, kho, sản phẩm, khoảng thời gian; phân trang.
- Thời gian lưu UTC và hiển thị theo múi giờ của tổ chức.
- Giao dịch đã ghi sổ không có nút sửa hoặc xóa.

*Tham chiếu: FR-05.06, OBJ-02, BR-008, BR-011*

---

## E7. Nhật ký hoạt động (AUD)

### US-AUD-01 – Xem audit log · P1
Là Owner hoặc Admin, tôi muốn xem nhật ký các thao tác quan trọng, để kiểm soát và điều tra khi cần.

- Audit log ghi: người thực hiện, hành động, đối tượng liên quan, thời điểm.
- Các hành động được ghi: đổi vai trò, tạo hoặc sửa hoặc lưu trữ sản phẩm và kho, nhập, xuất, điều chỉnh.
- Chỉ Owner và Admin xem được; chỉ thấy log của tổ chức hiện tại.
- Audit log không có chức năng sửa hoặc xóa.
- Mật khẩu và token tuyệt đối không xuất hiện trong log.

*Tham chiếu: UC-15, FR-08.01, FR-08.02, mục 8.5*

---

## Ma trận quyền đề xuất cho Release 1

> Đây là **đề xuất**, cần xác nhận lại trong quá trình thiết kế RBAC ở Phase 02. Mã quyền `MEMBER_MANAGE` và `ADJUST_STOCK` do tài liệu này đặt thêm, các mã còn lại lấy từ blueprint.

| Quyền | Owner | Admin | Warehouse Manager | Warehouse Staff |
|---|:-:|:-:|:-:|:-:|
| MEMBER_MANAGE (thêm, đổi vai trò, gỡ thành viên) | ✔ | ✔ | | |
| PRODUCT_VIEW | ✔ | ✔ | ✔ | ✔ |
| PRODUCT_CREATE / PRODUCT_UPDATE (gồm lưu trữ) | ✔ | ✔ | | |
| WAREHOUSE_MANAGE | ✔ | ✔ | ✔ | |
| INVENTORY_VIEW | ✔ | ✔ | ✔ | ✔ |
| RECEIVE_STOCK | ✔ | ✔ | ✔ | ✔ |
| ISSUE_STOCK | ✔ | ✔ | ✔ | ✔ |
| ADJUST_STOCK | ✔ | ✔ | ✔ | |
| AUDIT_LOG_VIEW | ✔ | ✔ | | |

## Câu hỏi còn mở

| # | Câu hỏi | Đề xuất tạm |
|---|---|---|
| 1 | Warehouse Manager có được tạo và sửa kho không? | Có (theo ma trận trên) |
| 2 | Mật khẩu cần quy tắc độ mạnh nào? | Tối thiểu 8 ký tự; bổ sung sau nếu cần |
| 3 | Số lần đăng nhập sai tối đa và thời gian khóa? | Chốt ở Phase 02 |
| 4 | Nhập kho có cần liên kết nhà cung cấp không? | Không, đợi Release 2 |
| 5 | Có cho phép tồn âm theo cấu hình tổ chức không? | Không trong Release 1 |