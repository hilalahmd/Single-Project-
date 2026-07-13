import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Salad,
  Cpu,
  MessageSquare,
  Bot,
  Video,
  CalendarDays,
  Settings,
  CheckSquare,
  DollarSign,
  BarChart3,
  Layers,
  UserCheck,
  Dumbbell,
  Award,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  LogOut,
  Shield,
  User,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// ── Nav item definitions per role ────────────────────────────────────────────

const clientNav = [
  { label: 'Dashboard',    to: '/dashboard',             icon: LayoutDashboard },
  { label: 'Nutrition',    to: '/dashboard/nutrition',   icon: Salad },
  { label: 'Workout',      to: '/dashboard/plans',       icon: Dumbbell },
  { label: 'Progress',     to: '/dashboard/progress',    icon: TrendingUp },
  { label: 'My Coach',     to: '/dashboard/coach',       icon: UserCheck },
  { label: 'Food AI',      to: '/dashboard/food-ai',     icon: Cpu },
  { label: 'AI Preview',   to: '/transform-preview',     icon: Sparkles },
  { label: 'AI Assistant', to: '/dashboard/ai',          icon: Bot },
  { label: 'Chat',         to: '/dashboard/chat',        icon: MessageSquare },
  { label: 'Schedule',     to: '/dashboard/schedule',    icon: CalendarDays },
  { label: 'Profile',      to: '/dashboard/profile',     icon: User },
  { label: 'Settings',     to: '/dashboard/settings',    icon: Settings },
]

const trainerNav = [
  { label: 'Dashboard',       to: '/trainer/dashboard',        icon: LayoutDashboard },
  { label: 'My Clients',      to: '/trainer/clients',          icon: Users },

  { label: 'Schedule',        to: '/trainer/schedule',         icon: CalendarDays },
  { label: 'Earnings',        to: '/trainer/earnings',         icon: DollarSign },
  { label: 'Chat',            to: '/trainer/chat',             icon: MessageSquare },
  { label: 'Video',           to: '/trainer/video',            icon: Video },
  { label: 'Profile',         to: '/trainer/profile',          icon: UserCheck },
  { label: 'Certificates',    to: '/trainer/certificates',     icon: Award },
]

const adminNav = [
  { label: 'Dashboard',     to: '/admin',                    icon: LayoutDashboard },
  { label: 'Approvals',     to: '/admin/approvals',          icon: CheckSquare },
  { label: 'Users',         to: '/admin/users',              icon: Users },
  { label: 'Managers',      to: '/admin/managers',           icon: Shield },
  { label: 'Payouts',       to: '/admin/payouts',            icon: DollarSign },
  { label: 'Revenue',       to: '/admin/revenue',            icon: BarChart3 },
  { label: 'Subscriptions', to: '/admin/subscriptions',      icon: Layers },
]

function useNavItems(role, subscriptionTier = 'free') {
  if (role === 'admin')   return adminNav
  if (role === 'trainer' || role === 'wellness_coach') return trainerNav
  return clientNav
}

export default function DashboardLayout() {
  const { role, logout, user, subscriptionTier } = useAuth()
  const { theme: themeMode, toggleTheme } = useTheme()
  const navItems = useNavItems(role, subscriptionTier)
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = searchQuery
    ? navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      navigate(searchResults[0].to)
      setSearchQuery('')
    }
  }

  const sidebarWidth = collapsed ? 'w-16' : 'w-56'
  const isAdminMode = role === 'admin'
  const isPremiumMode = !isAdminMode

  const BackgroundOrbs = () => isPremiumMode ? (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#07080C]">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#F97316]/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#F97316]/10 blur-[150px]" />
    </div>
  ) : null;

  // Dynamic Theme Classes
  const theme = {
    layout: isPremiumMode ? 'bg-[#07080C] text-white' : 'bg-[#F9FAFB] text-black',
    sidebar: isPremiumMode ? 'bg-[#07080C] border-r border-white/10' : 'bg-white border-gray-200',
    header: isPremiumMode ? 'bg-[#07080C] border-b border-white/10' : 'bg-white border-gray-200',
    logo: isPremiumMode ? 'text-white' : 'text-black',
    btnColor: isPremiumMode ? 'text-gray-400 hover:text-white transition-all hover:scale-110' : 'text-gray-500 hover:text-black transition-all hover:scale-110',
    searchContainer: isPremiumMode ? 'bg-[#111318] border-white/10 text-white placeholder-gray-500 focus:border-[#F97316]' : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-black',
    searchIcon: isPremiumMode ? 'text-gray-500' : 'text-gray-400',
    navActive: isPremiumMode ? 'bg-[#F97316]/10 text-white border-l-4 border-[#F97316]' : 'bg-gray-100 text-black border-l-4 border-black',
    navInactive: isPremiumMode ? 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent' : 'text-gray-500 hover:text-black hover:bg-gray-50 border-l-4 border-transparent',
    divider: isPremiumMode ? 'border-white/10' : 'border-gray-200',
    avatarBtn: isPremiumMode ? 'bg-[#F97316]/20 text-white border-[#F97316]/50 hover:bg-[#F97316]/30 transition-all hover:scale-105' : 'bg-black text-white hover:bg-gray-800 transition-all hover:scale-105',
    bellDot: isPremiumMode ? 'bg-[#F97316] border-[#07080C]' : 'bg-black border-white',
  }

  const SidebarContent = () => (
    <div className={`flex flex-col h-full relative z-10 ${isPremiumMode ? 'bg-[#07080C]' : 'bg-white'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <Link to="/" className={`text-2xl font-black tracking-tight font-['Syne'] ${theme.logo}`}>
                FITFORGE
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex items-center justify-center w-7 h-7 rounded transition-colors ml-auto ${theme.btnColor}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/trainer/dashboard' || to === '/admin'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 text-[14px] font-bold transition-colors ${
                isActive ? theme.navActive : theme.navInactive
              } ${collapsed ? 'justify-center px-0 border-l-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`shrink-0 transition-colors ${isActive ? (isPremiumMode ? 'text-[#F97316]' : 'text-black') : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="truncate whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Sign out */}
      <div className={`p-4 mt-auto border-t ${theme.divider}`}>
        <button onClick={logout} className={`flex items-center gap-4 px-2 py-2 w-full text-[14px] font-bold transition-colors ${theme.btnColor}`}>
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )

  const themeClass = isPremiumMode ? (themeMode === 'light' ? 'theme-light' : 'theme-dark') : ''

  return (
    <div className={`flex h-screen overflow-hidden font-['Inter'] relative ${themeClass} ${theme.layout}`}>
      <BackgroundOrbs />
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 224 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`hidden md:flex flex-col border-r shrink-0 overflow-hidden ${theme.sidebar}`}
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Content area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-transparent">
        
        {/* Top navbar */}
        <header className={`flex items-center gap-4 h-16 px-4 md:px-8 border-b shrink-0 ${theme.header}`}>
          <Link to="/" className={`md:hidden text-xl font-black tracking-tight font-['Syne'] ${theme.logo}`}>
            FITFORGE
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            {isPremiumMode && (
              <button 
                onClick={toggleTheme}
                className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all cursor-pointer ${
                  themeMode === 'light' 
                    ? 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316] hover:bg-[#F97316]/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            )}
            <button className={`relative flex items-center justify-center transition-colors ${theme.btnColor}`}>
              <Bell size={20} />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`absolute top-0 right-0 w-2 h-2 rounded-full border-2 ${theme.bellDot}`} 
              />
            </button>
            <Link 
              to={isPremiumMode && !isAdminMode ? '/dashboard/profile' : (isAdminMode ? '/admin' : '/trainer/profile')}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border shadow-sm cursor-pointer transition-all ${theme.avatarBtn}`}
            >
              {user?.name?.charAt(0) || 'U'}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-transparent relative">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center gap-6 overflow-x-auto px-6 py-3 border-t ${theme.sidebar} ${isPremiumMode ? 'bg-[#07080C]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]' : 'backdrop-blur-xl bg-opacity-95 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'}`}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/trainer/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 shrink-0 min-w-[3.5rem] transition-colors ${
                isActive ? (isPremiumMode ? 'text-[#F97316]' : 'text-black') : (isPremiumMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        {/* Mobile Logout Button */}
        <button 
          onClick={logout} 
          className={`flex flex-col items-center gap-1 shrink-0 min-w-[3.5rem] transition-colors ${isPremiumMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold opacity-80">Logout</span>
        </button>
      </nav>
    </div>
  )
}
