

# EDDGE Portal - Implementation Plan

## Overview
Building the complete EDDGE education portal with a simplified landing page (hero section only), credential-based auto-routing login, and all 5 role-based dashboards with green Planti-inspired theme.

---

## Phase 1: Foundation

### 1.1 Landing Page (Simplified)
- **Single Hero Section Only**:
  - Bold headline: "EDDGE - Your AI-Powered Education Operating System"
  - Subtitle explaining the platform benefits
  - Prominent "Sign In" button
  - Clean green gradient background with decorative elements
  - Fully responsive

### 1.2 Login System
- **Clean Login Form**: Email & password fields only (no role dropdown)
- **Auto Role Detection**: Credentials determine dashboard routing
- **Mock Users**:
  - `student@eddge.com` / `student123` → Student Dashboard
  - `teacher@eddge.com` / `teacher123` → Teacher Dashboard
  - `parent@eddge.com` / `parent123` → Parent Dashboard
  - `admin@eddge.com` / `admin123` → Admin Dashboard
  - `superadmin@eddge.com` / `super123` → Super Admin Dashboard

---

## Phase 2: Shared Components

### 2.1 Design System
- Green color palette (#22C55E primary)
- Reusable sidebar layout component
- Card components with soft shadows
- Consistent navigation patterns
- Mobile-responsive drawer sidebar

### 2.2 Auth Context
- User state management
- Protected route wrapper
- Role-based route guards

---

## Phase 3: Student Dashboard

### Pages & Features
1. **Home**: AI Avatar greeting, Today's Focus, XP/streak stats, subjects grid
2. **Learning**: Subject → Chapter → Concept viewer with adaptive content
3. **Practice**: Question cards, hints, difficulty indicators
4. **Tests**: Test list, mock exam mode, results
5. **Performance**: Strengths/weaknesses, progress charts, recommendations
6. **Attendance**: Calendar view, percentage display
7. **Settings**: Profile, preferences, avatar customization

---

## Phase 4: Teacher Dashboard

### Pages & Features
1. **Home**: Today's classes, pending tasks, alerts
2. **Classes**: Class management, student rosters
3. **Content**: Upload/manage learning materials
4. **Homework**: Create assignments, view submissions
5. **Exams**: Question bank, scheduling, results
6. **Analytics**: Student/class performance insights
7. **Attendance**: Mark and track attendance

---

## Phase 5: Parent Dashboard

### Pages & Features
1. **Home**: Child overview, key alerts
2. **Progress**: Academic performance, trends
3. **Homework**: Status and feedback
4. **Attendance**: Daily logs, alerts
5. **Communication**: Announcements, messaging

---

## Phase 6: School Admin Dashboard

### Pages & Features
1. **Home**: School-wide statistics
2. **Users**: Manage students, teachers, parents
3. **Academics**: Classes, subjects, timetables
4. **Reports**: Performance analytics, exports
5. **Announcements**: School notifications
6. **Settings**: System configuration

---

## Phase 7: Super Admin Dashboard

### Pages & Features
1. **Overview**: Platform metrics, system health
2. **Schools**: Multi-school management
3. **AI Control**: Prompt management, monitoring
4. **Security**: Audit logs, compliance
5. **Support**: Tickets, issue tracking

---

## Technical Structure

```
src/
├── contexts/AuthContext.tsx
├── data/mockData.ts
├── components/
│   ├── layout/DashboardLayout.tsx
│   ├── layout/Sidebar.tsx
│   ├── shared/Avatar.tsx
│   └── shared/StatCard.tsx
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── student/
│   ├── teacher/
│   ├── parent/
│   ├── admin/
│   └── superadmin/
```

---

## Key Deliverables

✅ Simplified landing page with hero section  
✅ Auto-detecting login system  
✅ All 5 complete dashboards  
✅ AI Avatar on Student Dashboard  
✅ Green Planti-inspired theme  
✅ Fully mobile responsive  
✅ Mock data for all features

