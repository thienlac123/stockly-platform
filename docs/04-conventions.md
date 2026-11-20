# Stockly – Quy ước làm việc

| Trường | Giá trị |
|---|---|
| Phiên bản | 1.0 |
| Ngày cập nhật | 20/11/2026 |

## 1. Ngôn ngữ

| Nội dung | Ngôn ngữ |
|---|---|
| Tài liệu trong `docs/` và README | Tiếng Việt (giữ thuật ngữ kỹ thuật bằng tiếng Anh) |
| Code, tên biến, tên bảng, tên nhánh | Tiếng Anh |
| Commit message, tiêu đề Pull Request | Tiếng Anh |
| Giao diện ứng dụng | Tiếng Anh |

## 2. Quy trình Git

**Phase 00:** commit thẳng vào `main` cho tài liệu.

**Từ Phase 01 trở đi:** `main` luôn ở trạng thái chạy được; mọi thay đổi đi qua nhánh và Pull Request.

### Đặt tên nhánh

| Tiền tố | Dùng cho | Ví dụ |
|---|---|---|
| `feature/` | Tính năng mới | `feature/auth-register` |
| `fix/` | Sửa lỗi | `fix/negative-stock` |
| `docs/` | Tài liệu lớn | `docs/api-spec` |
| `chore/` | Cấu hình, CI, dọn dẹp | `chore/ci-setup` |

### Commit message (Conventional Commits)

Định dạng: `type(scope): mô tả ngắn, viết ở thì hiện tại`

| Type | Dùng cho |
|---|---|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `docs` | Tài liệu |
| `refactor` | Tái cấu trúc, không đổi hành vi |
| `test` | Thêm hoặc sửa test |
| `chore` | Cấu hình, công cụ |

Ví dụ: `feat(auth): add register endpoint`, `fix(inventory): prevent negative stock on issue`.

### Pull Request

- Một PR một mục đích, nhỏ gọn.
- Mô tả: làm gì, liên quan story nào (ví dụ `US-AUTH-01`), kiểm tra thế nào.
- CI phải xanh trước khi merge.
- Merge bằng **Squash and merge**, xóa nhánh sau khi merge.

## 3. Quy ước đặt tên

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| Bảng và cột database | `snake_case`, tên bảng số nhiều | `inventory_balances`, `organization_id` |
| Biến, hàm | `camelCase` | `createProduct` |
| Class, type, component React | `PascalCase` | `ProductService`, `ProductList` |
| Hằng số | `UPPER_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| File | `kebab-case` (backend), `PascalCase` cho component React | `product.service.ts`, `ProductList.tsx` |

## 4. Quy ước API

- REST, đường dẫn dạng danh từ số nhiều: `/products`, `/warehouses`.
- Mã trạng thái chuẩn: 200, 201, 400 (dữ liệu sai), 401 (chưa đăng nhập), 403 (không đủ quyền), 404, 409 (xung đột), 422, 429 (quá giới hạn).
- Lỗi trả về cùng một định dạng JSON (mã lỗi, thông báo, chi tiết trường lỗi).
- Danh sách có phân trang, ví dụ `page`, `pageSize`.
- Tài liệu hóa bằng OpenAPI (Swagger).

## 5. Bảo mật khi làm việc

- Không bao giờ commit `.env`, mật khẩu, key. Chỉ commit `.env.example`.
- Không ghi mật khẩu, token vào log.
- Mọi endpoint nghiệp vụ phải kiểm tra tenant và quyền ở server.

## 6. Definition of Done cho một story

- [ ] Mọi tiêu chí nghiệm thu (AC) của story đều đạt.
- [ ] Có test tự động cho các AC quan trọng (đặc biệt cách ly tenant, tồn kho).
- [ ] Lint và build không lỗi, CI xanh.
- [ ] Không có lỗi trong console khi thử thật.
- [ ] API mới có trong tài liệu Swagger.
- [ ] Đã cập nhật tài liệu liên quan nếu thiết kế thay đổi.
- [ ] Đã merge vào `main` qua Pull Request.