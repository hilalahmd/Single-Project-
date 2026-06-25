import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './shared/context/AuthContext'
import ProtectedRoute from './shared/components/ProtectedRoute'

// Layouts
import MainLayout from './shared/layouts/MainLayout'
import AuthLayout from './shared/layouts/AuthLayout'
import DashboardLayout from './shared/layouts/DashboardLayout'

// ── Auth pages ───────────────────────────────────────────────────────────────
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import TrainerLoginPage from './features/auth/pages/TrainerLoginPage'
import TrainerRegisterPage from './features/auth/pages/TrainerRegisterPage'

import AdminLoginPage from './features/auth/pages/AdminLoginPage'
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage'
import EmailVerifyPage from './features/auth/pages/EmailVerifyPage'

// ── Client — Public pages ────────────────────────────────────────────────────
import LandingPage from './features/client/pages/LandingPage'
import FreeDietPlanPage from './features/client/pages/FreeDietPlanPage'
import SubscriptionPlansPage from './features/client/pages/SubscriptionPlansPage'

// ── Client — Dashboard pages ─────────────────────────────────────────────────
import ClientDashboardPage from './features/client/pages/ClientDashboardPage'
import MyPlansPage from './features/client/pages/MyPlansPage'
import ProgressTrackerPage from './features/client/pages/ProgressTrackerPage'
import SchedulePage from './features/client/pages/SchedulePage'
import CheckoutPage from './features/client/pages/CheckoutPage'
import ClientSettingsPage from './features/client/pages/ClientSettingsPage'
import NutritionTrackerPage from './features/client/pages/NutritionTrackerPage'
import FoodAIPage from './features/client/pages/FoodAIPage'
import AIAssistantPage from './features/client/pages/AIAssistantPage'

// ── Shared — Chat & Video (used by both client and trainer) ──────────────────
import ChatListPage from './features/client/pages/ChatListPage'
import ChatWindowPage from './features/client/pages/ChatWindowPage'
import VideoSessionPage from './features/client/pages/VideoSessionPage'

// ── Trainer — Public pages ───────────────────────────────────────────────────
import TrainerListingPage from './features/trainer/pages/TrainerListingPage'
import TrainerPublicProfilePage from './features/trainer/pages/TrainerPublicProfilePage'

// ── Trainer — Dashboard pages ────────────────────────────────────────────────
import TrainerDashboardPage from './features/trainer/pages/TrainerDashboardPage'
import ClientListPage from './features/trainer/pages/ClientListPage'
import TrainerSchedulePage from './features/trainer/pages/TrainerSchedulePage'
import EarningsPage from './features/trainer/pages/EarningsPage'
import TrainerProfileEditPage from './features/trainer/pages/TrainerProfileEditPage'
import CertificatesPage from './features/trainer/pages/CertificatesPage'
import WorkoutPlansPage from './features/trainer/pages/WorkoutPlansPage'
import TrainerPlanBuilderPage from './features/trainer/pages/TrainerPlanBuilderPage'
import DietPlansPage from './features/trainer/pages/DietPlansPage'

// ── Admin — Dashboard pages ──────────────────────────────────────────────────
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'
import TrainerApprovalsPage from './features/admin/pages/TrainerApprovalsPage'
import UserManagementPage from './features/admin/pages/UserManagementPage'
import ManagerManagementPage from './features/admin/pages/ManagerManagementPage'
import PayoutManagementPage from './features/admin/pages/PayoutManagementPage'
import RevenueReportsPage from './features/admin/pages/RevenueReportsPage'
import SubscriptionManagementPage from './features/admin/pages/SubscriptionManagementPage'

// ── 404 ──────────────────────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-9xl font-black text-black tracking-tighter">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-700">Page not found</p>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="mt-8 px-6 py-3 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
      >
        Go Home
      </a>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ── Auth — self-contained pages (own layout) ── */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/trainer-login" element={<TrainerLoginPage />} />
        <Route path="/auth/trainer-register" element={<TrainerRegisterPage />} />
        <Route path="/auth/admin/login" element={<AdminLoginPage />} />

        {/* ── Public routes — MainLayout (Navbar + Footer) ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/free-diet-plan" element={<FreeDietPlanPage />} />
          <Route path="/trainers" element={<TrainerListingPage />} />
          <Route path="/trainers/:id" element={<TrainerPublicProfilePage />} />
          <Route path="/plans" element={<SubscriptionPlansPage />} />
        </Route>

        {/* ── Auth routes — AuthLayout (centered card) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email" element={<EmailVerifyPage />} />
        </Route>

        {/* ── Client Dashboard (Protected) ── */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<ClientDashboardPage />} />
            <Route path="/dashboard/plans" element={<MyPlansPage />} />
            <Route path="/dashboard/progress" element={<ProgressTrackerPage />} />
            <Route path="/dashboard/nutrition" element={<NutritionTrackerPage />} />
            <Route path="/dashboard/food-ai" element={<FoodAIPage />} />
            <Route path="/dashboard/chat" element={<ChatListPage />} />
            <Route path="/dashboard/chat/:id" element={<ChatWindowPage />} />
            <Route path="/dashboard/ai" element={<AIAssistantPage />} />
            <Route path="/dashboard/video" element={<VideoSessionPage />} />
            <Route path="/dashboard/schedule" element={<SchedulePage />} />
            <Route path="/dashboard/subscription" element={<CheckoutPage />} />
            <Route path="/dashboard/settings" element={<ClientSettingsPage />} />
          </Route>
        </Route>

        {/* ── Trainer Dashboard (Protected) ── */}
        <Route element={<ProtectedRoute allowedRoles={['trainer', 'wellness_coach']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/trainer/dashboard" element={<TrainerDashboardPage />} />
            <Route path="/trainer/clients" element={<ClientListPage />} />
            <Route path="/trainer/plans/build/:id" element={<TrainerPlanBuilderPage />} />
            <Route path="/trainer/plans/workout" element={<WorkoutPlansPage />} />
            <Route path="/trainer/plans/diet" element={<DietPlansPage />} />
            <Route path="/trainer/schedule" element={<TrainerSchedulePage />} />
            <Route path="/trainer/earnings" element={<EarningsPage />} />
            <Route path="/trainer/chat" element={<ChatListPage />} />
            <Route path="/trainer/chat/:id" element={<ChatWindowPage />} />
            <Route path="/trainer/video" element={<VideoSessionPage />} />
            <Route path="/trainer/profile" element={<TrainerProfileEditPage />} />
            <Route path="/trainer/certificates" element={<CertificatesPage />} />
          </Route>
        </Route>

        {/* ── Admin Dashboard (Protected) ── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/approvals" element={<TrainerApprovalsPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/managers" element={<ManagerManagementPage />} />
            <Route path="/admin/payouts" element={<PayoutManagementPage />} />
            <Route path="/admin/revenue" element={<RevenueReportsPage />} />
            <Route path="/admin/subscriptions" element={<SubscriptionManagementPage />} />
          </Route>
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </AuthProvider>
  )
}

export default App
