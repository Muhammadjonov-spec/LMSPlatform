# Project: LMS QA Testing & Frontend Debugging

## Architecture
- **Frontend (`frontend/`)**: React 19 + Vite 7 + TailwindCSS 4 + React Router 7 + TanStack Query 5 + Axios + `@react-oauth/google` + `axios-mock-adapter`.
- **Backend (`src/`)**: Express.js REST API with MongoDB/Mongoose (Strictly READ-ONLY). All backend bugs and contract discrepancies are documented for manual remediation in `qa_report.md`.
- **Testing Track**: Independent opaque-box test runner covering Tiers 1-4 requirement-driven E2E tests, followed by Tier 5 adversarial hardening.

## Feature Inventory
| # | Feature / Area | Description | Milestone | Source |
|---|----------------|-------------|-----------|--------|
| 1 | Dependencies & Build | Ensure `@react-oauth/google`, `zustand`, `lucide-react` exist, clean build | M1 | Survey |
| 2 | Case-Sensitivity Fixes | Fix Linux/CI import casing for `ErrorToast` & `UseConfirmModal` | M1 | Survey |
| 3 | CSS Syntax Validation | Fix invalid `__qem` CSS units in `index.css` | M1 | Survey |
| 4 | SignUp Page Runtime Crash | Fix undeclared `mode`, `dataSignUp`, and `Pricing` in `SignUp/index.jsx` | M1 | Survey |
| 5 | Routing & Dead Links | Fix `Header.jsx` logout path (`/sign-in`), dead links in `SuccesCheckout` & `pricing.jsx` | M2 | Survey |
| 6 | Teacher Apply Routing | Add `/teacher/apply` route to `router/index.jsx` | M2 | Survey |
| 7 | TanStack Query v5 `isPending` | Replace deprecated `isLoading` with `isPending` across 8 mutation hooks | M2 | Survey |
| 8 | Auth & API Error Handling | Align `mockSetup.js` endpoints (`/auth/login`), prevent unhandled promise rejections, add user feedback | M2 | Survey |
| 9 | Content Schema Validation | Fix `zodSchema.js` edit mode so video file is optional during text edits | M3 | Survey |
| 10 | Safe Object Access | Add optional chaining for `category?.name`, `courses?.length`, etc. | M3 | Survey |
| 11 | Object URL Memory Cleanup | Memoize and revoke `URL.createObjectURL(file)` in Course/Student creators | M3 | Survey |
| 12 | React Attribute Warnings | Fix `.PropTypes` -> `.propTypes`, `class` -> `className` | M3 | Survey |
| 13 | Responsive Dashboard & Grids | Replace `w-[1525px]`, `w-[930px]`, `w-[550px]` with fluid Tailwind responsive classes | M4 | Survey |
| 14 | Mobile Navbar & Header Menus | Add interactive mobile drawer to `Navbar.jsx` and touch support for `Header.jsx` dropdown | M4 | Survey |
| 15 | Responsive Detail & Preview | Fix fixed widths in `Courses-Detail`, `Course-Preview`, and pricing cards | M4 | Survey |
| 16 | E2E Test Suite (Tiers 1-4) | Opaque-box E2E tests for auth, navigation, course CRUD, student management, responsive states | M5 | E2E Track |
| 17 | Adversarial Hardening (Tier 5) | Adversarial stress testing, edge cases, negative flows, regression guards | M5 | E2E Track |
| 18 | QA Report & Backend Catalog | Final `qa_report.md` detailing all frontend fixes and full backend defect inventory | M5 | Synthesis |
| 19 | Auth Header Layout Cleanup | Fix duplicate buttons & full Navbar in `SignUp/index.jsx` & `SignUp/pricing.jsx` | M2 | User Feedback |
| 20 | Landing Page Section Anchors | Add `id="features"`, `id="pricing"`, `id="testimonials"` to `Landing/index.jsx` | M2 | User Feedback |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dependencies & Critical Crash Fixes | Fix `package.json`, `SignUp/index.jsx`, casing imports, `index.css` | none | DONE |
| M2 | Authentication & Routing Alignment | Fix logout routing, teacher apply route, TanStack Query v5 `isPending`, auth error handling | M1 | DONE |
| M3 | Data Forms & State Safety | Fix Zod video edit validation, optional chaining, ObjectURL memory cleanup, PropTypes | M2 | PLANNED |
| M4 | UI/UX Responsiveness & Mobile UX | Responsive containers, mobile hamburger menu, touch dropdowns, grid breakpoints | M3 | PLANNED |
| M5 | E2E Verification, Adversarial Hardening & QA Report | 100% E2E test pass, Tier 5 adversarial review, Read-Only backend audit, generate `qa_report.md` | M4, TEST_READY | PLANNED |

## Interface Contracts
### Auth API Contract (Mock & Backend Compatible)
- `POST /auth/login` (and fallback `POST /sign-in`): `{ email, password }` -> `{ token, role, user: { id, name, email, role, avatar } }`
- `POST /auth/register` (and fallback `POST /sign-up`): `{ name, email, password, role }` -> `{ token, role, user }`
- `POST /auth/google`: `{ credential }` -> `{ token, role, user }`
- `POST /auth/logout`: `{}` -> `{ success: true }`

### Course & Category API Contract
- `GET /courses`: Query `{ page, limit, search, category }` -> `{ data: Course[], total: number }`
- `POST /courses`: FormData or JSON -> `{ data: Course }`
- `GET /categories`: Query `{}` -> `{ data: Category[] }`

### Error Interceptor Contract
- All 4xx/5xx responses caught and transformed into user-facing Toast alerts without crashing UI state.

## Code Layout
- Frontend Root: `E:\AIProjects\LMS\frontend\` (Full Write Access)
  - `src/components/`: Shared UI elements (`Navbar`, `Header`, `Sidebar`, `common/`)
  - `src/pages/`: Page containers (`SignIn`, `SignUp`, `Landing`, `Manager/`, `Shared/`, `TeacherApply/`)
  - `src/services/`: Axios service layers
  - `src/store/`: State management
  - `src/utils/`: Helpers, validation schemas (`zodSchema.js`), Axios interceptors
  - `src/mockSetup.js`: Mock data & API simulation layer
- Backend Root: `E:\AIProjects\LMS\src\` (**STRICTLY READ-ONLY**)
- Root Project Files: `E:\AIProjects\LMS\` (Metadata & `qa_report.md` only)
