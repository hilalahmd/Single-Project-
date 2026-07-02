import { useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
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
  User
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

// ── Nav item definitions per role ────────────────────────────────────────────

const clientNav = [
  { label: 'Dashboard',    to: '/dashboard',             icon: LayoutDashboard },
  { label: 'Nutrition',    to: '/dashboard/nutrition',   icon: Salad },
  { label: 'Workout',      to: '/dashboard/plans',       icon: Dumbbell },
  { label: 'Progress',     to: '/dashboard/progress',    icon: TrendingUp },
  { label: 'My Coach',     to: '/dashboard/video',       icon: UserCheck },
  { label: 'Food AI',      to: '/dashboard/food-ai',     icon: Cpu },
  { label: 'AI Assistant', to: '/dashboard/ai',          icon: Bot },
  { label: 'Chat',         to: '/dashboard/chat',        icon: MessageSquare },
  { label: 'Schedule',     to: '/dashboard/schedule',    icon: CalendarDays },
  { label: 'Profile',      to: '/dashboard/profile',     icon: User },
  { label: 'Settings',     to: '/dashboard/settings',    icon: Settings },
]

const trainerNav = [
  { label: 'Dashboard',       to: '/trainer/dashboard',        icon: LayoutDashboard },
  { label: 'My Clients',      to: '/trainer/clients',          icon: Users },
  { label: 'Workout Plans',   to: '/trainer/plans/workout',    icon: Dumbbell },
  { label: 'Diet Plans',      to: '/trainer/plans/diet',       icon: Salad },
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

function useNavItems(role) {
  if (role === 'admin')   return adminNav
  if (role === 'trainer' || role === 'wellness_coach') return trainerNav
  return clientNav
}

export default function DashboardLayout() {
  const { role, logout, user } = useAuth()
  const navItems = useNavItems(role)

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarWidth = collapsed ? 'w-16' : 'w-56'
  const isAdminMode = role === 'admin'
  const isClientMode = role === 'user'

  const BackgroundOrbs = () => isClientMode ? (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#07080C]">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#F97316]/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#F97316]/10 blur-[150px]" />
    </div>
  ) : null;

  // Dynamic Theme Classes
  const theme = {
    layout: isClientMode ? 'bg-[#07080C] text-white' : (isAdminMode ? 'bg-[#F9FAFB] text-black' : 'bg-[#07080C] text-white'),
    sidebar: isClientMode ? 'bg-[#07080C] border-r border-white/10' : (isAdminMode ? 'bg-white border-gray-200' : 'bg-[#07080C] border-white/10'),
    header: isClientMode ? 'bg-[#07080C] border-b border-white/10' : (isAdminMode ? 'bg-white border-gray-200' : 'bg-[#07080C] border-white/10'),
    logo: isClientMode ? 'text-white' : (isAdminMode ? 'text-black' : 'text-white'),
    btnColor: isClientMode ? 'text-gray-400 hover:text-white' : (isAdminMode ? 'text-gray-500 hover:text-black' : 'text-gray-400 hover:text-white'),
    searchContainer: isClientMode ? 'bg-[#111318] border-white/10 text-white placeholder-gray-500 focus:border-[#F97316]' : (isAdminMode ? 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-black' : 'bg-[#111318] border-white/10 text-white placeholder-gray-500 focus:border-[#F97316]'),
    searchIcon: isClientMode ? 'text-gray-500' : (isAdminMode ? 'text-gray-400' : 'text-gray-500'),
    navActive: isClientMode ? 'bg-[#F97316]/10 text-white border-r-4 border-[#F97316]' : (isAdminMode ? 'bg-gray-100 text-black border-r-4 border-black' : 'bg-[#F97316]/10 text-white border-r-4 border-[#F97316]'),
    navInactive: isClientMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : (isAdminMode ? 'text-gray-500 hover:text-black hover:bg-gray-50' : 'text-gray-400 hover:text-white hover:bg-white/5'),
    divider: isClientMode ? 'border-white/10' : (isAdminMode ? 'border-gray-200' : 'border-white/10'),
    avatarBtn: isClientMode ? 'bg-[#F97316]/20 text-white border-[#F97316]/50 hover:bg-[#F97316]/30' : (isAdminMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-[#F97316]/20 text-white border-[#F97316]/50 hover:bg-[#F97316]/30'),
    bellDot: isClientMode ? 'bg-[#F97316] border-[#07080C]' : (isAdminMode ? 'bg-black border-white' : 'bg-[#F97316] border-[#07080C]'),
  }

  const SidebarContent = () => (
    <div className={`flex flex-col h-full relative z-10 ${isClientMode ? 'bg-[#07080C]' : isAdminMode ? 'bg-white' : 'bg-[#07080C]'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        {!collapsed && (
          <Link to="/" className={`text-2xl font-black tracking-tight font-['Syne'] ${theme.logo}`}>
            FITFORGE
          </Link>
        )}
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
              } ${collapsed ? 'justify-center px-0 border-r-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Sign out */}
      <div className={`p-4 mt-auto border-t ${theme.divider}`}>
        <button onClick={logout} className={`flex items-center gap-4 px-2 py-2 w-full text-[14px] font-bold transition-colors ${theme.btnColor}`}>
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className={`flex h-screen overflow-hidden font-['Inter'] relative ${theme.layout}`}>
      <BackgroundOrbs />
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:flex flex-col ${sidebarWidth} border-r shrink-0 transition-all duration-200 ease-in-out ${theme.sidebar}`}
      >
        <SidebarContent />
      </aside>


      {/* ── Content area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-transparent">
        
        {/* Top navbar */}
        <header className={`flex items-center gap-4 h-16 px-4 md:px-8 border-b shrink-0 ${theme.header}`}>
          <Link to="/" className={`md:hidden text-xl font-black tracking-tight font-['Syne'] ${theme.logo}`}>
            FITFORGE
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.searchIcon}`} />
            <input 
              type="text"
              placeholder="Search..."
              className={`w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none transition-all ${theme.searchContainer}`}
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className={`relative flex items-center justify-center transition-colors ${theme.btnColor}`}>
              <Bell size={20} />
              <span className={`absolute top-0 right-0 w-2 h-2 rounded-full border-2 ${theme.bellDot}`} />
            </button>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border shadow-sm cursor-pointer transition-colors ${theme.avatarBtn}`}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-transparent relative">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center gap-6 overflow-x-auto px-6 py-3 border-t ${theme.sidebar} ${isClientMode ? 'bg-[#07080C]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]' : 'backdrop-blur-xl bg-opacity-95 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'}`}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/trainer/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 shrink-0 min-w-[3.5rem] transition-colors ${
                isActive ? (isClientMode ? 'text-[#F97316]' : (isAdminMode ? 'text-black' : 'text-[#F97316]')) : (isClientMode ? 'text-gray-400 hover:text-white' : (isAdminMode ? 'text-gray-500 hover:text-black' : 'text-gray-500 hover:text-gray-300'))
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
          className={`flex flex-col items-center gap-1 shrink-0 min-w-[3.5rem] transition-colors ${isClientMode ? 'text-red-400 hover:text-red-300' : (isAdminMode ? 'text-red-500 hover:text-red-600' : 'text-red-400 hover:text-red-300')}`}
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold opacity-80">Logout</span>
        </button>
      </nav>
    </div>
  )
}
