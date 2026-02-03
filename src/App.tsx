import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentHome from "./pages/student/StudentHome";
import StudentPlanner from "./pages/student/StudentPlanner";
import StudentLearning from "./pages/student/StudentLearning";
import StudentPractice from "./pages/student/StudentPractice";
import StudentTests from "./pages/student/StudentTests";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentSettings from "./pages/student/StudentSettings";
import StudentAchievements from "./pages/student/StudentAchievements";

// Teacher Pages
import TeacherHome from "./pages/teacher/TeacherHome";

// Parent Pages
import ParentDashboardHome from "./pages/parent/ParentDashboardHome";
import ParentChildProgress from "./pages/parent/ParentChildProgress";
import ParentAchievements from "./pages/parent/ParentAchievements";
import ParentMeetings from "./pages/parent/ParentMeetings";
import ParentCommunications from "./pages/parent/ParentCommunications";
import ParentHomework from "./pages/parent/ParentHomework";
import ParentAnnouncements from "./pages/parent/ParentAnnouncements";
import ParentSettings from "./pages/parent/ParentSettings";
import ParentSupport from "./pages/parent/ParentSupport";
import ParentChildDetails from "./pages/parent/ParentChildDetails";

// Admin Pages
import AdminHome from "./pages/admin/AdminHome";

// Super Admin Pages
import SuperAdminHome from "./pages/superadmin/SuperAdminHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/planner" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPlanner />
              </ProtectedRoute>
            } />
            <Route path="/student/learning" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLearning />
              </ProtectedRoute>
            } />
            <Route path="/student/practice" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPractice />
              </ProtectedRoute>
            } />
            <Route path="/student/tests" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentTests />
              </ProtectedRoute>
            } />
            <Route path="/student/performance" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPerformance />
              </ProtectedRoute>
            } />
            <Route path="/student/attendance" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAttendance />
              </ProtectedRoute>
            } />
            <Route path="/student/achievements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAchievements />
              </ProtectedRoute>
            } />
            <Route path="/student/settings" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSettings />
              </ProtectedRoute>
            } />
            {/* Catch-all student routes */}
            <Route path="/student/*" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHome />
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherHome />
              </ProtectedRoute>
            } />
            <Route path="/teacher/*" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherHome />
              </ProtectedRoute>
            } />

            {/* Parent Routes */}
            <Route path="/parent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboardHome />
              </ProtectedRoute>
            } />
            <Route path="/parent/child-progress/:childId" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentChildProgress />
              </ProtectedRoute>
            } />
            <Route path="/parent/achievements" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentAchievements />
              </ProtectedRoute>
            } />
            <Route path="/parent/meetings" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentMeetings />
              </ProtectedRoute>
            } />
            <Route path="/parent/communications" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentCommunications />
              </ProtectedRoute>
            } />
            <Route path="/parent/homework" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentHomework />
              </ProtectedRoute>
            } />
            <Route path="/parent/announcements" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/parent/settings" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentSettings />
              </ProtectedRoute>
            } />
            <Route path="/parent/support" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentSupport />
              </ProtectedRoute>
            } />
            <Route path="/parent/child/:childId" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentChildDetails />
              </ProtectedRoute>
            } />
            <Route path="/parent/*" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboardHome />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHome />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHome />
              </ProtectedRoute>
            } />

            {/* Super Admin Routes */}
            <Route path="/superadmin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminHome />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/*" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminHome />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;