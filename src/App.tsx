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
import ParentHome from "./pages/parent/ParentHome";

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
                <ParentHome />
              </ProtectedRoute>
            } />
            <Route path="/parent/*" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentHome />
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