# EDDGE – Project Documentation

**Single source of truth for the EDDGE Growth Hub.**  
When you add, change, or remove features, routes, dashboards, or data—update this file so it stays accurate.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Scripts](#2-tech-stack--scripts)
3. [Authentication & Roles](#3-authentication--roles)
4. [Routing Summary](#4-routing-summary)
5. [Student Dashboard](#5-student-dashboard)
6. [Teacher Dashboard](#6-teacher-dashboard)
7. [Parent Dashboard](#7-parent-dashboard)
8. [Admin Dashboard (School)](#8-admin-dashboard-school)
9. [Super Admin & Internal Admin](#9-super-admin--internal-admin)
10. [Shared Code & Data](#10-shared-code--data)
11. [Changelog & How to Update This Doc](#11-changelog--how-to-update-this-doc)

---

## 1. Project Overview

- **Name:** EDDGE Growth Hub (internal package name: `vite_react_shadcn_ts`)
- **Type:** Multi-role education portal (students, teachers, parents, school admins, superadmin/internal admin)
- **Stack:** React 18, TypeScript, Vite 5, React Router 6, Tailwind CSS, Radix UI (shadcn/ui), TanStack Query
- **Entry:** `src/main.tsx` → `App.tsx` (AuthProvider, Router, Routes)

**Quick start:** `npm install` → `npm run dev` (e.g. http://localhost:8080). Log in with any mock user from [§3](#3-authentication--roles).

---

## 2. Tech Stack & Scripts

| Category        | Technology / Package                          |
|----------------|-----------------------------------------------|
| Build          | Vite 5                                        |
| UI             | React 18, Tailwind CSS, Radix/shadcn components |
| Routing        | react-router-dom v6                           |
| State / Data   | React state, TanStack React Query, Contexts   |
| Forms          | react-hook-form, zod, @hookform/resolvers     |
| Charts         | recharts                                      |
| Toasts         | sonner, Radix Toast                          |
| Icons          | lucide-react                                  |

**Scripts (`package.json`):**

| Script        | Command           | Purpose                    |
|---------------|-------------------|----------------------------|
| `dev`         | `vite`            | Start dev server (e.g. :8080) |
| `devtools`    | `react-devtools`  | Run standalone React DevTools |
| `build`       | `vite build`      | Production build           |
| `build:dev`   | `vite build --mode development` | Dev-mode build |
| `preview`     | `vite preview`    | Preview production build   |
| `lint`        | `eslint .`        | Run ESLint                 |
| `test`        | `vitest run`      | Run tests once             |
| `test:watch`  | `vitest`          | Run tests in watch mode    |

---

## 3. Authentication & Roles

- **Provider:** `src/contexts/AuthContext.tsx`
- **Protection:** `src/components/auth/ProtectedRoute.tsx` — redirects unauthenticated users to `/login` and wrong-role users to their role’s default route.

**Roles and default routes:**

| Role         | Default route   | Description              |
|--------------|-----------------|--------------------------|
| `student`    | `/student`      | Student portal            |
| `teacher`    | `/teacher`      | Teacher portal            |
| `parent`     | `/parent`       | Parent portal             |
| `admin`      | `/admin`        | School admin              |
| `superadmin` | `/superadmin` → redirects to `/internal-admin` | Platform-level admin |

**Mock login (for development):**

| Email                 | Password   | Role         |
|-----------------------|------------|--------------|
| student@eddge.com     | student123 | student      |
| teacher@eddge.com     | teacher123 | teacher      |
| parent@eddge.com     | parent123  | parent       |
| admin@eddge.com      | admin123   | admin        |
| superadmin@eddge.com | super123   | superadmin   |

- User is stored in `localStorage` under `eddge_user`; logout clears it.

---

## 4. Routing Summary

- **Public:** `/`, `/login`
- **Student:** `/student`, `/student/*` (see [§5](#5-student-dashboard))
- **Teacher:** `/teacher`, `/teacher/*` (see [§6](#6-teacher-dashboard))
- **Parent:** `/parent`, `/parent/*` (see [§7](#7-parent-dashboard))
- **Admin:** `/admin`, `/admin/*` (see [§8](#8-admin-dashboard-school))
- **Super Admin:** `/superadmin`, `/superadmin/*` → redirect to `/internal-admin`
- **Internal Admin:** `/internal-admin`, `/internal-admin/*` (see [§9](#9-super-admin--internal-admin))
- **Catch-all:** `*` → `NotFound`

All dashboard routes use `ProtectedRoute` with the appropriate `allowedRoles`. Internal admin routes use `allowedRoles={['superadmin']}`.

---

## 5. Student Dashboard

**Layout:** `StudentDashboardLayout`  
**Sidebar:** `StudentSidebar`  
**Base path:** `/student`  
**Allowed role:** `student`

### Layout & Shell

- **File:** `src/components/layout/StudentDashboardLayout.tsx`
- Desktop: collapsible sidebar (260px / 0), sticky header, main content.
- Mobile: sidebar in Sheet (left), hamburger in header.
- Header: welcome text (“Welcome to EDDGE”, “Hello {firstName}”), center search (placeholder only, no handler), Messages + Notifications + Avatar popover (Settings, Logout). Class shown in popover: “Class 9 • CBSE” (hardcoded).

### Sidebar navigation (`StudentSidebar.tsx`)

- **Dashboard** → `/student`
- **Learning:** Planner, Personalized Learn, Practice, Revision, AI Doubt Solver
- **Resources:** Study Resources, PYQ Papers
- **Updates:** Events & Announcements, Attendance, Homework
- **Progress:** Performance, Achievements
- Bottom: Help Center (→ `/student/help`), Logout

**Note:** `/student/tests` has a route and page but no sidebar link.

### Student routes & pages

| Route                    | Page component          | Description / content (current) |
|--------------------------|-------------------------|----------------------------------|
| `/student`               | StudentHome             | Dashboard: Today’s Focus, My Stats, Overall Progress, My Learning (subjects), Weekly Performance, Upcoming Tasks, Recent Activity |
| `/student/planner`       | StudentPlanner         | Daily plan, task timeline, exam mode, learning readiness, calendar |
| `/student/learning`      | StudentLearning        | Subject/chapter selection, learning engine (Foundation, Concept, A.C.E, Exit) |
| `/student/practice`      | StudentPractice        | Practice flow using practice questions |
| `/student/revision`      | StudentRevision        | Revision content |
| `/student/tests`         | StudentTests            | Tests & exams (no sidebar link) |
| `/student/performance`   | StudentPerformance      | Average score, XP, study time, weekly chart, strengths/weak areas |
| `/student/attendance`    | StudentAttendance       | Attendance stats and recent days |
| `/student/achievements`   | StudentAchievements     | Badges / milestones |
| `/student/settings`      | StudentSettings         | Profile, avatar, notification toggles (local state only) |
| `/student/doubt-solver`  | StudentDoubtSolver      | AI chat UI with history sidebar; mock responses, no real API |
| `/student/resources`    | StudentResources        | Study resources |
| `/student/pyq`           | StudentPYQ              | Previous year papers |
| `/student/announcements`  | StudentAnnouncements    | Events & announcements |
| `/student/homework`      | StudentHomework         | Homework list (pending/submitted/graded) |
| `/student/help`          | StudentHelp             | FAQ accordion, help resources, contact form |
| `/student/*`             | StudentHome             | Catch-all |

### Student data sources

- **Shared:** `src/data/mockData.ts` — `subjects`, `chapters`, `practiceQuestions`, `upcomingTests`, `studentPerformance`, `attendance`, etc.
- **Doubt solver:** `src/components/doubt-solver/mockData.ts` — `mockConversations`, `mockResponses`
- **Page-level:** Many pages (e.g. StudentHome, StudentPlanner, StudentHomework) also use inline mock data.

---

## 6. Teacher Dashboard

**Layout:** `TeacherDashboardLayout`  
**Sidebar:** `TeacherSidebar`  
**Base path:** `/teacher`  
**Allowed role:** `teacher`

### Layout & Shell

- **File:** `src/components/layout/TeacherDashboardLayout.tsx`
- Same pattern: collapsible sidebar, sticky header, responsive sheet on mobile.

### Sidebar navigation (`TeacherSidebar.tsx`)

Teacher has two modes (Class Teacher / Subject Teacher) via `TeacherModeContext`:

**Class Teacher mode:**

- Dashboard → `/teacher`
- My Class: Students, Behaviour & Notes
- Class Analytics: Overall Performance, Subject-wise Analysis, At-Risk Students
- Assessments
- Communication: Parent Messages, Student Messages, Announcements, PTM Scheduling
- Reports: Student Reports, Class Summary

**Subject Teacher mode:**

- Dashboard → `/teacher`
- My Subject: Classes, Students
- Subject Analytics: Chapters, Topics (and sub-routes)
- AI Tools (and sub-routes)

Plus Settings, Support, Logout as applicable.

### Teacher routes & pages

| Route | Page component | Description (current) |
|-------|----------------|------------------------|
| `/teacher` | TeacherHome | Dashboard |
| `/teacher/my-class/students` | TeacherStudents | Class students |
| `/teacher/my-class/behaviour` | TeacherBehaviour | Behaviour & notes |
| `/teacher/class-analytics` | TeacherClassAnalytics | Class analytics (overall/subject-wise/at-risk) |
| `/teacher/class-analytics/overall` | TeacherClassAnalytics | Same |
| `/teacher/class-analytics/subject-wise` | TeacherClassAnalytics | Same |
| `/teacher/class-analytics/at-risk` | TeacherClassAnalytics | Same |
| `/teacher/assessments` | TeacherAssessments | Assessments |
| `/teacher/communication` | TeacherCommunication | Communication |
| `/teacher/communication/students` | TeacherCommunication | Same |
| `/teacher/announcements/events` | TeacherEvents | Events |
| `/teacher/meetings` | TeacherMeetings | Meetings |
| `/teacher/reports` | TeacherReports | Reports |
| `/teacher/reports/students` | TeacherReports | Same |
| `/teacher/reports/class-summary` | TeacherReports | Same |
| `/teacher/reports/subject-performance` | TeacherReports | Same |
| `/teacher/settings` | TeacherSettings | Settings |
| `/teacher/support` | TeacherSupport | Support |
| `/teacher/my-subject/classes` | TeacherSubjectClasses | Subject classes |
| `/teacher/my-subject/students` | TeacherSubjectStudents | Subject students |
| `/teacher/subject-analytics/*` | TeacherSubjectAnalytics | Subject analytics |
| `/teacher/ai-tools/*` | TeacherAITools | AI tools |
| `/teacher/*` | TeacherHome | Catch-all |

### Teacher data

- Uses `src/data/mockData.ts` (e.g. `teacherClasses`, `pendingTasks`, `atRiskStudents`) and `src/data/teacherMockData.ts` where present.

---

## 7. Parent Dashboard

**Layout:** `ParentDashboardLayout`  
**Sidebar:** `ParentSidebar`  
**Base path:** `/parent`  
**Allowed role:** `parent`

### Layout & Shell

- **File:** `src/components/layout/ParentDashboardLayout.tsx`

### Sidebar navigation (`ParentSidebar.tsx`)

- **Dashboard** → `/parent`
- **Performance:** Progress (→ `/parent/child-progress/1`), Achievements
- **Communication:** Meetings, Messages (Communications)
- **Learning:** Homework, Announcements
- Help Center, Logout

### Parent routes & pages

| Route | Page component | Description (current) |
|-------|----------------|------------------------|
| `/parent` | ParentDashboardHome | Dashboard |
| `/parent/child-progress/:childId` | ParentChildProgress | Child progress |
| `/parent/achievements` | ParentAchievements | Achievements |
| `/parent/meetings` | ParentMeetings | Meetings |
| `/parent/communications` | ParentCommunications | Communications |
| `/parent/homework` | ParentHomework | Homework |
| `/parent/announcements` | ParentAnnouncements | Announcements |
| `/parent/settings` | ParentSettings | Settings |
| `/parent/support` | ParentSupport | Support |
| `/parent/child/:childId` | ParentChildDetails | Child details |
| `/parent/*` | ParentDashboardHome | Catch-all |

### Parent data

- Uses `src/data/mockData.ts` (e.g. `childInfo`) and `src/data/parentMockData.ts` where present. `ChildContext` may be used for selected child.

---

## 8. Admin Dashboard (School)

**Layout:** `AdminDashboardLayout`  
**Sidebar:** `AdminSidebar`  
**Base path:** `/admin`  
**Allowed role:** `admin`

### Layout & Shell

- **File:** `src/components/layout/AdminDashboardLayout.tsx`

### Sidebar navigation (`AdminSidebar.tsx`)

- **Dashboard** → `/admin`
- **Management:** Teachers, Students, Classes, Attendance
- **Administration:** Reports, Announcements, Finance, Settings
- Logout

### Admin routes & pages

| Route | Page component | Description (current) |
|-------|----------------|------------------------|
| `/admin` | AdminHome | Dashboard |
| `/admin/teachers` | AdminTeachers | Teachers |
| `/admin/students` | AdminStudents | Students |
| `/admin/classes` | AdminClasses | Classes |
| `/admin/attendance` | AdminAttendance | Attendance |
| `/admin/reports` | AdminReports | Reports |
| `/admin/announcements` | AdminAnnouncements | Announcements |
| `/admin/finance` | AdminFinance | Finance |
| `/admin/settings` | AdminSettings | Settings |
| `/admin/*` | AdminHome | Catch-all |

### Admin data

- Mock data in pages and/or `src/data/mockData.ts`; no dedicated admin API file listed.

---

## 9. Super Admin & Internal Admin

**Super Admin:** `/superadmin` and `/superadmin/*` render `SuperAdminHome`, which immediately redirects to `/internal-admin`.  
**Internal Admin** is the real super-admin UI.

**Layout:** `InternalAdminDashboardLayout`  
**Sidebar:** `InternalAdminSidebar`  
**Base path:** `/internal-admin`  
**Allowed role:** `superadmin`

### Sidebar navigation (`InternalAdminSidebar.tsx`)

- Platform Overview → `/internal-admin`
- School Registry → `/internal-admin/schools`
- Usage Analytics → `/internal-admin/analytics`
- Billing → `/internal-admin/billing`
- System Health → `/internal-admin/health`
- Security & Compliance → `/internal-admin/security`
- Logout

### Internal admin routes & pages

| Route | Page component | Description (current) |
|-------|----------------|------------------------|
| `/internal-admin` | InternalAdminOverview | Platform overview |
| `/internal-admin/schools` | InternalAdminSchools | School registry |
| `/internal-admin/analytics` | InternalAdminAnalytics | Usage analytics |
| `/internal-admin/billing` | InternalAdminBilling | Billing |
| `/internal-admin/health` | InternalAdminHealth | System health |
| `/internal-admin/security` | InternalAdminSecurity | Security & compliance |
| `/internal-admin/*` | InternalAdminOverview | Catch-all |

### Internal admin data / API

- **Service:** `src/services/internalAdminApi.ts` — mock API with types for platform overview, schools, subscriptions, usage analytics, billing, health, security. Used by internal admin pages.

---

## 10. Shared Code & Data

### Layout components (`src/components/layout/`)

| Component | Used by |
|-----------|---------|
| StudentDashboardLayout | All student pages |
| StudentSidebar | StudentDashboardLayout |
| TeacherDashboardLayout | All teacher pages |
| TeacherSidebar | TeacherDashboardLayout |
| ParentDashboardLayout | All parent pages |
| ParentSidebar | ParentDashboardLayout |
| AdminDashboardLayout | All admin pages |
| AdminSidebar | AdminDashboardLayout |
| InternalAdminDashboardLayout | All internal admin pages |
| InternalAdminSidebar | InternalAdminDashboardLayout |
| DashboardLayout | (if used elsewhere) |

### Auth & protection

- `src/contexts/AuthContext.tsx` — user, login, logout, `getRoleRoute`
- `src/components/auth/ProtectedRoute.tsx` — role-based route protection

### Other contexts

- `src/contexts/TeacherModeContext.tsx` — class vs subject teacher mode
- `src/contexts/ChildContext.tsx` — parent’s selected child (if used)
- `src/contexts/LanguageContext.tsx` — language (if used)

### Shared UI (`src/components/`)

- **ui/** — shadcn-style components (button, card, dialog, input, tabs, etc.)
- **shared/** — StatCard, EmptyState, LoadingState, AIAvatar
- **doubt-solver/** — ChatMessage, ChatInput, ChatHistory, ThinkingIndicator, EmptyState, types, mockData
- **admin/** — AdminStatCard
- **NavLink.tsx** — reusable nav link

### Data files

| File | Contents (summary) |
|------|--------------------|
| `src/data/mockData.ts` | subjects, chapters, practiceQuestions, upcomingTests, studentPerformance, attendance, teacherClasses, pendingTasks, atRiskStudents, childInfo, etc. |
| `src/data/teacherMockData.ts` | Teacher-specific mock data |
| `src/data/parentMockData.ts` | Parent-specific mock data |
| `src/components/doubt-solver/mockData.ts` | mockConversations, mockResponses for AI Doubt Solver |

### Services

| File | Purpose |
|------|---------|
| `src/services/internalAdminApi.ts` | Mock internal admin API (schools, analytics, billing, health, security) |

### Public pages

- `src/pages/Landing.tsx` — `/`
- `src/pages/Login.tsx` — `/login`
- `src/pages/NotFound.tsx` — `*`
- `src/pages/Index.tsx` — (if used as redirect or entry)

---

## 11. Changelog & How to Update This Doc

**Rule:** Whenever you change the project in a way that affects routes, roles, dashboards, pages, data, or scripts—update **EDDGE.md** in the same PR/commit.

### What to update

- **New or removed route** → Update [§4](#4-routing-summary) and the relevant dashboard section (§5–§9), including the route table and sidebar list.
- **New or removed page** → Add/remove the row in that dashboard’s “routes & pages” table and mention the file under `src/pages/<role>/`.
- **Sidebar nav change** → Update the “Sidebar navigation” list for that dashboard.
- **New layout or role** → Add a new section (or subsection), mirroring the structure above.
- **New shared component, context, data file, or service** → Update [§10](#10-shared-code--data).
- **New script or dependency** → Update [§2](#2-tech-stack--scripts) and/or package list.
- **Auth/roles change** → Update [§3](#3-authentication--roles) and any affected route tables.

### Changelog (add new entries at the top)

| Date | Change |
|------|--------|
| (Initial) | Created EDDGE.md with full project documentation: all dashboards (Student, Teacher, Parent, Admin, Internal Admin), routes, sidebars, data sources, shared code, and update instructions. |

---

*End of EDDGE.md. Keep this file as the single source of truth for the project.*
