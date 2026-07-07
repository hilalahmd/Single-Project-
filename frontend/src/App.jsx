import { Routes, Route } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'
import { AuthProvider } from './shared/context/AuthContext'
import { ThemeProvider } from './shared/context/ThemeContext'
import ProtectedRoute from './shared/components/ProtectedRoute'
import GlobalLoader from './shared/components/GlobalLoader'

// Layouts
import MainLayout from './shared/layouts/MainLayout'
import AuthLayout from './shared/layouts/AuthLayout'
import DashboardLayout from './shared/layouts/DashboardLayout'
import ClientAppLayout from './shared/layouts/ClientAppLayout'

// ── Auth pages ───────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'))
const TrainerLoginPage = lazy(() => import('./features/auth/pages/TrainerLoginPage'))
const TrainerRegisterPage = lazy(() => import('./features/auth/pages/TrainerRegisterPage'))

const AdminLoginPage = lazy(() => import('./features/auth/pages/AdminLoginPage'))
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage'))
const EmailVerifyPage = lazy(() => import('./features/auth/pages/EmailVerifyPage'))

// ── Client — Public pages ────────────────────────────────────────────────────
const LandingPage = lazy(() => import('./features/client/pages/LandingPage'))
const FreeDietPlanPage = lazy(() => import('./features/client/pages/FreeDietPlanPage'))
const SubscriptionPlansPage = lazy(() => import('./features/client/pages/SubscriptionPlansPage'))
const TransformPreviewPage = lazy(() => import('./features/client/pages/TransformPreviewPage'))

// ── Client — Dashboard pages ─────────────────────────────────────────────────
const ClientDashboardPage = lazy(() => import('./features/client/pages/ClientDashboardPage'))
const MyPlansPage = lazy(() => import('./features/client/pages/MyPlansPage'))
const ProgressTrackerPage = lazy(() => import('./features/client/pages/ProgressTrackerPage'))
const SchedulePage = lazy(() => import('./features/client/pages/SchedulePage'))
const CheckoutPage = lazy(() => import('./features/client/pages/CheckoutPage'))
const ClientSettingsPage = lazy(() => import('./features/client/pages/ClientSettingsPage'))
const ClientProfilePage = lazy(() => import('./features/client/pages/ClientProfilePage'))
const MyCoachPage = lazy(() => import('./features/client/pages/MyCoachPage'))
const NutritionTrackerPage = lazy(() => import('./features/client/pages/NutritionTrackerPage'))
const FoodAIPage = lazy(() => import('./features/client/pages/FoodAIPage'))
const AIAssistantPage = lazy(() => import('./features/client/pages/AIAssistantPage'))

// ── Shared — Chat & Video (used by both client and trainer) ──────────────────
const ChatListPage = lazy(() => import('./features/client/pages/ChatListPage'))
const ChatWindowPage = lazy(() => import('./features/client/pages/ChatWindowPage'))
const VideoSessionPage = lazy(() => import('./features/client/pages/VideoSessionPage'))

// ── Trainer — Public pages ───────────────────────────────────────────────────
const TrainerListingPage = lazy(() => import('./features/trainer/pages/TrainerListingPage'))
const TrainerPublicProfilePage = lazy(() => import('./features/trainer/pages/TrainerPublicProfilePage'))

// ── Trainer — Dashboard pages ────────────────────────────────────────────────
const TrainerDashboardPage = lazy(() => import('./features/trainer/pages/TrainerDashboardPage'))
const ClientListPage = lazy(() => import('./features/trainer/pages/ClientListPage'))
const TrainerSchedulePage = lazy(() => import('./features/trainer/pages/TrainerSchedulePage'))
const EarningsPage = lazy(() => import('./features/trainer/pages/EarningsPage'))
const TrainerProfileEditPage = lazy(() => import('./features/trainer/pages/TrainerProfileEditPage'))
const CertificatesPage = lazy(() => import('./features/trainer/pages/CertificatesPage'))
const WorkoutPlansPage = lazy(() => import('./features/trainer/pages/WorkoutPlansPage'))
const TrainerPlanBuilderPage = lazy(() => import('./features/trainer/pages/TrainerPlanBuilderPage'))
const DietPlansPage = lazy(() => import('./features/trainer/pages/DietPlansPage'))

// ── Admin — Dashboard pages ──────────────────────────────────────────────────
const AdminDashboardPage = lazy(() => import('./features/admin/pages/AdminDashboardPage'))
const TrainerApprovalsPage = lazy(() => import('./features/admin/pages/TrainerApprovalsPage'))
const UserManagementPage = lazy(() => import('./features/admin/pages/UserManagementPage'))
const ManagerManagementPage = lazy(() => import('./features/admin/pages/ManagerManagementPage'))
const PayoutManagementPage = lazy(() => import('./features/admin/pages/PayoutManagementPage'))
const RevenueReportsPage = lazy(() => import('./features/admin/pages/RevenueReportsPage'))
const SubscriptionManagementPage = lazy(() => import('./features/admin/pages/SubscriptionManagementPage'))

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
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>

          {/* ── Auth — self-contained pages (own layout) ── */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/trainer-login" element={<TrainerLoginPage />} />
          <Route path="/auth/trainer-register" element={<TrainerRegisterPage />} />
          <Route path="/auth/admin/login" element={<AdminLoginPage />} />

          {/* ── Public routes — MainLayout (Navbar + Footer) ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/free-diet-plan" element={<FreeDietPlanPage />} />
            <Route path="/transform-preview" element={<TransformPreviewPage />} />
            <Route path="/trainers" element={<TrainerListingPage />} />
            <Route path="/trainers/:id" element={<TrainerPublicProfilePage />} />
            <Route path="/plans" element={<SubscriptionPlansPage />} />
          </Route>

          {/* ── Auth routes — AuthLayout (centered card) ── */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<EmailVerifyPage />} />
          </Route>

          {/* ── Client Dashboard (Protected) ── */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<ClientAppLayout />}>
              <Route path="/dashboard" element={<ClientDashboardPage />} />
              <Route path="/dashboard/plans" element={<MyPlansPage />} />
              <Route path="/dashboard/progress" element={<ProgressTrackerPage />} />
              <Route path="/dashboard/nutrition" element={<NutritionTrackerPage />} />
              <Route path="/dashboard/food-ai" element={<FoodAIPage />} />
              <Route path="/dashboard/chat" element={<ChatListPage />} />
              <Route path="/dashboard/chat/:id" element={<ChatWindowPage />} />
              <Route path="/dashboard/ai" element={<AIAssistantPage />} />
              <Route path="/dashboard/coach" element={<MyCoachPage />} />
              <Route path="/dashboard/video/:sessionId" element={<VideoSessionPage />} />
              <Route path="/dashboard/schedule" element={<SchedulePage />} />
              <Route path="/dashboard/subscription" element={<CheckoutPage />} />
              <Route path="/dashboard/settings" element={<ClientSettingsPage />} />
              <Route path="/dashboard/profile" element={<ClientProfilePage />} />
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
      </Suspense>
    </AuthProvider>
  </ThemeProvider>
  )
}

export default App
