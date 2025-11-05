---
mode: agent
---
Define the task to achieve, including specific requirements, constraints, and success criteria.

## Project Goal
**Enhance the Vue 3 + Vite CMS frontend** with **reusable, well-structured components** for:
- Login
- Dashboard
- Post CRUD (List, Create, Edit, Delete)
- Layout (Header, Sidebar, Auth Guard)
- Form handling with validation
- API integration using Axios + TanStack Query (Vue Query)
- Responsive UI with Tailwind CSS

All components must be **type-safe (TypeScript)**, **modular**, and **integrated with Laravel Sanctum API**.

**Fully containerized with Docker** for consistent development, testing, and production deployment.

---

### Core Requirements

| Feature               | Specification |
|-----------------------|-------------|
| **Frontend Stack**    | Vue 3 (Composition API) + TypeScript + Vite + Tailwind CSS |
| **State Management**  | TanStack Query (`@tanstack/vue-query`) |
| **HTTP Client**       | Axios (with interceptors for token + CSRF) |
| **Routing**           | Vue Router (`vue-router@4`) |
| **Auth Flow**         | CSRF cookie → Login → Store token in `localStorage` → Auto-attach Bearer → Protected routes via Navigation Guards |
| **Components**        | `LoginForm.vue`, `AppLayout.vue`, `Sidebar.vue`, `PostList.vue`, `PostForm.vue`, `Dashboard.vue`, `AuthGuard` (via route meta + navigation guards) |
| **Build Output**      | `vite build` → `backend/public/cms` |
| **Dev Server**        | `http://localhost:3000` (proxies `/api` → Nginx) |
| **Dockerization**     | Multi-stage Dockerfile + `docker-compose.yml` for dev/prod parity |

---

### Success Criteria
- [x] User can **login** → receives token → auto-redirect to dashboard
- [x] **Protected routes** redirect to login if not authenticated (using `beforeEach` navigation guard)
- [x] **Post CRUD** fully functional (List, Create, Edit, Delete)
- [x] Responsive **sidebar + header** layout using `<AppLayout>` with `<slot>` for content
- [x] All API calls use **Vue Query** with loading/error states (`isLoading`, `isError`, `error`)
- [x] Form validation with **Zod + `vee-validate` + `toTypedSchema`**
- [x] Components are **reusable**, **typed with TypeScript**, and **styled with Tailwind**
- [x] Works in **dev (`docker compose up`)** and **production (`docker compose -f docker-compose.prod.yml up -d`)**
- [x] **Zero-config local dev** via Docker: `docker compose up --build`
- [x] **Production build** outputs static assets to Laravel `public/cms` via volume or build-stage copy

---

### Project Structure (Frontend)
```bash
### Project Structure
```bash
laravel-cms/
├── backend/                  # Laravel API
│   ├── app/
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── routes/api.php
│   ├── .env
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── LoginForm.tsx
│   │   ├── PostList.tsx
│   │   ├── PostForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PostsPage.tsx
│   │   └── PostEditPage.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── queryClient.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
└── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md