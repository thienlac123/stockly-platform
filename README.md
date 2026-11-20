# Stockly Platform

Stockly là nền tảng SaaS quản lý tồn kho và vận hành kho dành cho doanh nghiệp vừa và nhỏ, hỗ trợ nhiều doanh nghiệp dùng chung hệ thống (multi-tenant). Đây là dự án portfolio fullstack, được xây dựng để thực hành thiết kế backend theo hướng thực tế: đa tenant, phân quyền theo vai trò (RBAC) và quản lý tồn kho bằng giao dịch.

> **Trạng thái:** Phase 00 – Khảo sát và chuẩn bị nền tảng. Hiện chỉ có tài liệu, chưa có code ứng dụng.

## Công nghệ dự kiến

| Tầng | Công nghệ |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | NestJS, TypeScript |
| Cơ sở dữ liệu | PostgreSQL, Prisma |
| Hạ tầng | Docker Compose, GitHub Actions |

## Cấu trúc dự kiến

```
stockly-platform/
├── backend/          # API server (Phase 01)
├── frontend/         # Ứng dụng web (Phase 01)
├── docs/             # Product brief, ERD, các quyết định kiến trúc
└── docker-compose.yml
```

## Tài liệu

- [Product Brief](docs/01-product-brief.md)
- [User Stories](docs/02-user-stories.md)
- [ERD](docs/03-erd.md)
- [Quy ước làm việc](docs/04-conventions.md)
- [Wireframes](docs/05-wireframes.md)
- Các quyết định kiến trúc (ADR): thư mục `docs/adr/`

## Lộ trình

| Phase | Nội dung |
|---|---|
| 00 | Khảo sát, chốt phạm vi, viết tài liệu |
| 01 | Dựng khung dự án, Docker, CI |
| 02 | Xác thực, Organization, RBAC |
| 03 | Sản phẩm và kho |
| 04 | Inventory Engine (ledger, giao dịch) |
| 05 | Mua hàng và chuyển kho |
| 06 | Dashboard và báo cáo |
| 07 | Kiểm thử và hardening |
| 08 | Triển khai và phát hành |

## Liên quan

- Landing page giới thiệu sản phẩm (repo riêng): https://github.com/thienlac123/stockly
- Demo landing page: https://stockly-one-gray.vercel.app/