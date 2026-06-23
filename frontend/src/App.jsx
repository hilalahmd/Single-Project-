import { Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from './shared/layouts/MainLayout'
import AuthLayout from './shared/layouts/AuthLayout'
import DashboardLayout from './shared/layouts/DashboardLayout'

// ── Bare routes (self-contained pages with own layout) ──────────────────────
// LandingPage has its own navbar + footer embedded
import LandingPage from './modules/client/pages/LandingPage'
// LoginPage has its own header + full-page layout
import LoginPage from './modules/auth/pages/LoginPage'
// FreeDietPlanPage has its own self-contained layout
import FreeDietPlanPage from './modules/client/pages/FreeDietPlanPage'

// ── Public pages (use MainLayout: Navbar + Footer) ──────────────────────────
import TrainerListingPage from './modules/trainer/pages/TrainerListingPage'
import TrainerPublicProfilePage from './modules/trainer/pages/TrainerPublicProfilePage'
import SubscriptionPlansPage from './modules/client/pages/SubscriptionPlansPage'

// ── Auth pages (use AuthLayout: centered card) ───────────────────────────────
import RegisterPage from './modules/auth/pages/RegisterPage'
import TrainerRegisterPage from './modules/auth/pages/TrainerRegisterPage'
import TrainerLoginPage from './modules/auth/pages/TrainerLoginPage'
import AdminLoginPage from './modules/auth/pages/AdminLoginPage'
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage'
import EmailVerifyPage from './modules/auth/pages/EmailVerifyPage'

// ── Client dashboard pages ───────────────────────────────────────────────────
import ClientDashboardPage from './modules/dashboard/pages/ClientDashboardPage'
import MyPlansPage from './modules/client/pages/MyPlansPage'
import ProgressTrackerPage from './modules/client/pages/ProgressTrackerPage'
import SchedulePage from './modules/client/pages/SchedulePage'
import CheckoutPage from './modules/client/pages/CheckoutPage'
import ClientSettingsPage from './modules/client/pages/ClientSettingsPage'

// ── Nutrition pages ──────────────────────────────────────────────────────────
import NutritionTrackerPage from './modules/nutrition/pages/NutritionTrackerPage'
import FoodAIPage from './modules/nutrition/pages/FoodAIPage'
import DietPlansPage from './modules/nutrition/pages/DietPlansPage'

// ── Chat pages ───────────────────────────────────────────────────────────────
import ChatListPage from './modules/chat/pages/ChatListPage'
import ChatWindowPage from './modules/chat/pages/ChatWindowPage'

// ── AI & Video ───────────────────────────────────────────────────────────────
import AIAssistantPage from './modules/ai/pages/AIAssistantPage'
import VideoSessionPage from './modules/video/pages/VideoSessionPage'

// ── Trainer dashboard pages ──────────────────────────────────────────────────
import TrainerDashboardPage from './modules/trainer/pages/TrainerDashboardPage'
import ClientListPage from './modules/trainer/pages/ClientListPage'
import TrainerSchedulePage from './modules/trainer/pages/TrainerSchedulePage'
import EarningsPage from './modules/trainer/pages/EarningsPage'
import TrainerProfileEditPage from './modules/trainer/pages/TrainerProfileEditPage'
import CertificatesPage from './modules/trainer/pages/CertificatesPage'
import WorkoutPlansPage from './modules/workout/pages/WorkoutPlansPage'

// ── Admin pages ──────────────────────────────────────────────────────────────
import AdminDashboardPage from './modules/admin/pages/AdminDashboardPage'
import TrainerApprovalsPage from './modules/admin/pages/TrainerApprovalsPage'
import UserManagementPage from './modules/admin/pages/UserManagementPage'
import ManagerManagementPage from './modules/admin/pages/ManagerManagementPage'
import PayoutManagementPage from './modules/admin/pages/PayoutManagementPage'
import RevenueReportsPage from './modules/admin/pages/RevenueReportsPage'
import SubscriptionManagementPage from './modules/admin/pages/SubscriptionManagementPage'

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
    <Routes>

      {/* ── Bare routes — self-contained pages (own navbar/footer) ── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/free-diet-plan" element={<FreeDietPlanPage />} />
      <Route path="/auth/login" element={<LoginPage />} />

      {/* ── Public routes — wrapped in MainLayout (Navbar + Footer) ── */}
      <Route element={<MainLayout />}>
        <Route path="/trainers" element={<TrainerListingPage />} />
        <Route path="/trainers/:id" element={<TrainerPublicProfilePage />} />
        <Route path="/plans" element={<SubscriptionPlansPage />} />
      </Route>

      {/* ── Auth routes — wrapped in AuthLayout (centered card) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/trainer-register" element={<TrainerRegisterPage />} />
        <Route path="/auth/trainer-login" element={<TrainerLoginPage />} />
        <Route path="/auth/admin-login" element={<AdminLoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<EmailVerifyPage />} />
      </Route>

      {/* ── Client Dashboard ── */}
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

      {/* ── Trainer Dashboard ── */}
      <Route element={<DashboardLayout />}>
        <Route path="/trainer/dashboard" element={<TrainerDashboardPage />} />
        <Route path="/trainer/clients" element={<ClientListPage />} />
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

      {/* ── Admin Dashboard ── */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/approvals" element={<TrainerApprovalsPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/managers" element={<ManagerManagementPage />} />
        <Route path="/admin/payouts" element={<PayoutManagementPage />} />
        <Route path="/admin/revenue" element={<RevenueReportsPage />} />
        <Route path="/admin/subscriptions" element={<SubscriptionManagementPage />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App