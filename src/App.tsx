import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SuperAdminProtectedRoute from "@/components/auth/SuperAdminProtectedRoute";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentHome from "./pages/student/StudentHome";
import StudentPlanner from "./pages/student/StudentPlanner";
import StudentLearning from "./pages/student/StudentLearning";
import StudentPractice from "./pages/student/StudentPractice";
import StudentRevision from "./pages/student/StudentRevision";
import StudentTests from "./pages/student/StudentTests";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentSettings from "./pages/student/StudentSettings";
import StudentAchievements from "./pages/student/StudentAchievements";
import StudentDoubtSolver from "./pages/student/StudentDoubtSolver";
import StudentResources from "./pages/student/StudentResources";
import StudentPYQ from "./pages/student/StudentPYQ";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentHomework from "./pages/student/StudentHomework";
import StudentHelp from "./pages/student/StudentHelp";

// Teacher Pages
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherBehaviour from "./pages/teacher/TeacherBehaviour";
import TeacherClassAnalytics from "./pages/teacher/TeacherClassAnalytics";
import TeacherAssessments from "./pages/teacher/TeacherAssessments";
import TeacherCommunication from "./pages/teacher/TeacherCommunication";
import TeacherEvents from "./pages/teacher/TeacherEvents";
import TeacherMeetings from "./pages/teacher/TeacherMeetings";
import TeacherReports from "./pages/teacher/TeacherReports";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import TeacherSupport from "./pages/teacher/TeacherSupport";
import TeacherSubjectClasses from "./pages/teacher/TeacherSubjectClasses";
import TeacherSubjectStudents from "./pages/teacher/TeacherSubjectStudents";
import TeacherSubjectAnalytics from "./pages/teacher/TeacherSubjectAnalytics";
import TeacherAITools from "./pages/teacher/TeacherAITools";
import TeacherStudentProfile from "./pages/teacher/TeacherStudentProfile";
import TeacherTasks from "./pages/teacher/TeacherTasks";
import TeacherParentEngagement from "./pages/teacher/TeacherParentEngagement";

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
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminClassAnalysis from "./pages/admin/AdminClassAnalysis";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminReports from "./pages/admin/AdminReports";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSettings from "./pages/admin/AdminSettings";
import StudentProfile from "./pages/admin/StudentProfile";
import TeacherProfile from "./pages/admin/TeacherProfile";
import ClassDetail from "./pages/admin/ClassDetail";

// SuperAdmin Dashboard Pages
import SuperAdminHome from "./pages/superadmin-dashboard/SuperAdminHome";
import SuperAdminOverview from "./pages/superadmin-dashboard/SuperAdminOverview";
import SuperAdminSchools from "./pages/superadmin-dashboard/SuperAdminSchools";
import SuperAdminAnalytics from "./pages/superadmin-dashboard/SuperAdminAnalytics";
import SuperAdminBilling from "./pages/superadmin-dashboard/SuperAdminBilling";
import SuperAdminHealth from "./pages/superadmin-dashboard/SuperAdminHealth";
import SuperAdminSecurity from "./pages/superadmin-dashboard/SuperAdminSecurity";
import SuperAdminFeatures from "./pages/superadmin-dashboard/SuperAdminFeatures";
import SuperAdminAlerts from "./pages/superadmin-dashboard/SuperAdminAlerts";
import SuperAdminAdminAudit from "./pages/superadmin-dashboard/SuperAdminAdminAudit";
import SuperAdminExport from "./pages/superadmin-dashboard/SuperAdminExport";
import SuperAdminAICosts from "./pages/superadmin-dashboard/SuperAdminAICosts";
import SuperAdminOnboarding from "./pages/superadmin-dashboard/SuperAdminOnboarding";
import SuperAdminOnboardingReview from "./pages/superadmin-dashboard/SuperAdminOnboardingReview";
import SchoolOnboardingWizard from "./pages/onboarding/SchoolOnboardingWizard";
import SuperAdminAdmins from "./pages/superadmin-dashboard/SuperAdminAdmins";
import SuperAdminSettings from "./pages/superadmin-dashboard/SuperAdminSettings";
import SuperAdminIncidents from "./pages/superadmin-dashboard/SuperAdminIncidents";
import SuperAdminAdoption from "./pages/superadmin-dashboard/SuperAdminAdoption";
import SuperAdminSupport from "./pages/superadmin-dashboard/SuperAdminSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <AdminDataProvider>
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
            <Route path="/student/revision" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentRevision />
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
            <Route path="/student/doubt-solver" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDoubtSolver />
              </ProtectedRoute>
            } />
            <Route path="/student/resources" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentResources />
              </ProtectedRoute>
            } />
            <Route path="/student/pyq" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPYQ />
              </ProtectedRoute>
            } />
            <Route path="/student/announcements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/student/homework" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHomework />
              </ProtectedRoute>
            } />
            <Route path="/student/help" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentHelp />
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
            <Route path="/teacher/my-class/students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudents /></ProtectedRoute>} />
            <Route path="/teacher/student-profile/:studentId" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherStudentProfile /></ProtectedRoute>} />
            <Route path="/teacher/my-class/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/teacher/tasks" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherTasks /></ProtectedRoute>} />
            <Route path="/teacher/parent-engagement" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherParentEngagement /></ProtectedRoute>} />
            <Route path="/teacher/class-analytics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClassAnalytics /></ProtectedRoute>} />
            <Route path="/teacher/assessments" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAssessments /></ProtectedRoute>} />
            <Route path="/teacher/communication" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCommunication /></ProtectedRoute>} />
            <Route path="/teacher/communication/students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherCommunication /></ProtectedRoute>} />
            <Route path="/teacher/announcements/events" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherEvents /></ProtectedRoute>} />
            <Route path="/teacher/meetings" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherMeetings /></ProtectedRoute>} />
            <Route path="/teacher/reports" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherReports /></ProtectedRoute>} />
            <Route path="/teacher/reports/students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherReports /></ProtectedRoute>} />
            <Route path="/teacher/reports/class-summary" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherReports /></ProtectedRoute>} />
            <Route path="/teacher/reports/subject-performance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherReports /></ProtectedRoute>} />
            <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSettings /></ProtectedRoute>} />
            <Route path="/teacher/support" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSupport /></ProtectedRoute>} />
            <Route path="/teacher/my-subject/classes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectClasses /></ProtectedRoute>} />
            <Route path="/teacher/my-subject/students" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectStudents /></ProtectedRoute>} />
            <Route path="/teacher/subject-analytics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectAnalytics /></ProtectedRoute>} />
            <Route path="/teacher/subject-analytics/chapters" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectAnalytics /></ProtectedRoute>} />
            <Route path="/teacher/subject-analytics/topics" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectAnalytics /></ProtectedRoute>} />
            <Route path="/teacher/subject-analytics/mistakes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectAnalytics /></ProtectedRoute>} />
            <Route path="/teacher/ai-tools/*" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAITools /></ProtectedRoute>} />
            <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherHome /></ProtectedRoute>} />

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
            <Route path="/admin/teachers" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTeachers />
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStudents />
              </ProtectedRoute>
            } />
            <Route path="/admin/students/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/teachers/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TeacherProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin/classes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminClasses />
              </ProtectedRoute>
            } />
            <Route path="/admin/classes/:id" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ClassDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/class-analysis" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminClassAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAttendance />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
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

            {/* Internal Admin Routes - Redirect to SuperAdmin Dashboard */}
            <Route path="/internal-admin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminHome />
              </ProtectedRoute>
            } />
            <Route path="/internal-admin/*" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminHome />
              </ProtectedRoute>
            } />

            {/* SuperAdmin Dashboard Routes */}
            <Route path="/dashboard/superadmin" element={
              <SuperAdminProtectedRoute>
                <SuperAdminOverview />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/schools" element={
              <SuperAdminProtectedRoute>
                <SuperAdminSchools />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/analytics" element={
              <SuperAdminProtectedRoute>
                <SuperAdminAnalytics />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/features" element={
              <SuperAdminProtectedRoute>
                <SuperAdminFeatures />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/alerts" element={
              <SuperAdminProtectedRoute>
                <SuperAdminAlerts />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/audit" element={
              <SuperAdminProtectedRoute>
                <SuperAdminAdminAudit />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/billing" element={
              <SuperAdminProtectedRoute>
                <SuperAdminBilling />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/health" element={
              <SuperAdminProtectedRoute>
                <SuperAdminHealth />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/security" element={
              <SuperAdminProtectedRoute>
                <SuperAdminSecurity />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/export" element={
              <SuperAdminProtectedRoute>
                <SuperAdminExport />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/ai-costs" element={
              <SuperAdminProtectedRoute>
                <SuperAdminAICosts />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/admins" element={
              <SuperAdminProtectedRoute>
                <SuperAdminAdmins />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/settings" element={
              <SuperAdminProtectedRoute>
                <SuperAdminSettings />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/incidents" element={
              <SuperAdminProtectedRoute>
                <SuperAdminIncidents />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/adoption" element={
              <SuperAdminProtectedRoute>
                <SuperAdminAdoption />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/support" element={
              <SuperAdminProtectedRoute>
                <SuperAdminSupport />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/onboarding" element={
              <SuperAdminProtectedRoute>
                <SuperAdminOnboarding />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/onboarding/review" element={
              <SuperAdminProtectedRoute>
                <SuperAdminOnboardingReview />
              </SuperAdminProtectedRoute>
            } />
            <Route path="/dashboard/superadmin/*" element={
              <SuperAdminProtectedRoute>
                <SuperAdminOverview />
              </SuperAdminProtectedRoute>
            } />

            {/* School Onboarding Wizard - Public route with token validation */}
            <Route path="/onboarding/school" element={<SchoolOnboardingWizard />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AdminDataProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
