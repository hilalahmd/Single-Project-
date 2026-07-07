import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  Dumbbell,
  UserCheck,
  TrendingUp,
  Bot,
  Salad,
  Cpu,
  MessageSquare,
  CalendarDays,
  Sparkles,
  Settings,
  LogOut,
  User,
  X,
  MoreHorizontal,
  ChevronDown,
  Bell,
  Sun,
  Moon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const primaryNav = [
  { label: 'Home',     to: '/',                   icon: Home },
  { label: 'Today',    to: '/dashboard',          icon: LayoutDashboard },
  { label: 'Plan',     to: '/dashboard/plans',    icon: Dumbbell },
  { label: 'Coach',    to: '/dashboard/coach',    icon: UserCheck },
  { label: 'Nutrition',to: '/dashboard/nutrition',icon: Salad },
  { label: 'Food AI',  to: '/dashboard/food-ai',  icon: Cpu },
  { label: 'Progress', to: '/dashboard/progress', icon: TrendingUp },
]

const secondaryNav = [
  { label: 'Chatbot',     to: '/dashboard/ai',       icon: Bot },
  { label: 'Settings',    to: '/dashboard/settings',  icon: Settings },
]

export default function ClientAppLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  
  const profileDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Background specific to client app
  const BackgroundOrbs = () => (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#07080C]'}`}>
      {theme !== 'light' && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[#F97316] opacity-[0.12] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#a855f7] opacity-[0.12] blur-[120px]" />
        </>
      )}
    </div>
  )

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-['Inter'] relative transition-colors duration-300 ${theme === 'light' ? 'bg-[#F8FAFC] text-[#0F172A]' : 'bg-[#07080C] text-white'}`}>
      <BackgroundOrbs />

      {/* ── Desktop Top Navigation ── */}
      <header className={`hidden md:flex items-center justify-between h-20 px-6 lg:px-10 border-b shrink-0 z-50 transition-colors duration-300 relative ${theme === 'light' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-100' : 'bg-[#07080C]/40 border-white/10 backdrop-blur-lg'}`}>
        
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/" className={`text-2xl font-black tracking-[-0.05em] font-['Syne'] ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>
            FITFORGE
          </Link>
        </div>

        {/* Center: Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {primaryNav.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `relative py-1 text-[11px] font-bold uppercase tracking-widest transition-colors 
                 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F97316] 
                 after:rounded-full after:origin-center after:transition-transform after:duration-300 
                 ${isActive ? 'text-[#F97316] after:scale-x-100' : `${theme === 'light' ? 'text-[#64748B]' : 'text-gray-300'} hover:text-[#F97316] after:scale-x-0 hover:after:scale-x-100 hover:after:bg-[#F97316]`}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: Actions + Profile */}
        <div className="flex items-center justify-end gap-6 flex-1">

          <button 
            onClick={toggleTheme}
            className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all cursor-pointer ${
              theme === 'light' 
                ? 'text-[#F97316] hover:bg-black/5' 
                : 'text-gray-300 hover:text-[#F97316] hover:bg-white/5'
            }`}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-transparent transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'text-[#64748B] hover:text-[#F97316] border border-gray-200 hover:border-[#F97316]/50'
                  : 'text-gray-300 hover:text-[#F97316] border border-white/15 hover:border-[#F97316]/50'
              }`}
              title="My Profile"
            >
              <User size={18} />
            </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className={`absolute top-[120%] right-0 w-64 border rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-4 z-50 ${theme === 'light' ? 'bg-white border-gray-100 text-[#0F172A]' : 'bg-[#111318] border-white/10 text-white'}`}>
              <div className={`px-4 py-3 border-b mb-2 ${theme === 'light' ? 'border-gray-100' : 'border-white/10'}`}>
                <p className="font-bold truncate">{user?.name || 'User'}</p>
                <p className={`text-xs truncate ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{user?.email}</p>
              </div>
              
              <Link to="/dashboard/profile" onClick={() => setProfileOpen(false)} className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                <User size={16} /> My Profile
              </Link>
              
              {secondaryNav.map(({ label, to, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setProfileOpen(false)} className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
              
              <div className={`h-px my-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-white/10'}`} />
              
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-500 hover:bg-red-400/10 transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
          </div>
        </div>
      </header>

      {/* ── Mobile Top Header (Minimal) ── */}
      <header className={`md:hidden flex items-center justify-between h-14 px-4 border-b shrink-0 z-40 backdrop-blur-lg transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white/80 border-gray-200'
          : 'bg-[#07080C]/40 border-white/10'
      }`}>
        <Link to="/dashboard/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#F97316] to-[#ff8c3a] text-white font-bold text-xs uppercase shadow-sm">
           {user?.name?.charAt(0) || 'U'}
        </Link>
        <Link to="/" className={`text-xl font-black tracking-tight font-['Syne'] ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>
          FITFORGE
        </Link>
        <button className={`relative ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#F97316]" />
        </button>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-20 md:pb-0 scroll-smooth">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-2 sm:px-6 py-2 pb-safe backdrop-blur-xl border-t transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white/95 border-gray-200'
          : 'bg-[#07080C]/95 border-white/10'
      }`}>
        {primaryNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={() => setMobileMoreOpen(false)}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 min-w-[3.5rem] py-1 transition-colors ${
                isActive 
                  ? 'text-[#F97316]' 
                  : theme === 'light' ? 'text-gray-500 hover:text-[#0F172A]' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        
        {/* Mobile More Button */}
        <button 
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`flex flex-col items-center gap-1 min-w-[3.5rem] py-1 transition-colors ${
            mobileMoreOpen 
              ? theme === 'light' ? 'text-[#0F172A]' : 'text-white' 
              : theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          <MoreHorizontal size={22} strokeWidth={mobileMoreOpen ? 2.5 : 2} />
          <span className="text-[10px] font-bold opacity-80">More</span>
        </button>
      </nav>

      {/* ── Mobile More Menu Overlay ── */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setMobileMoreOpen(false)}>
          <div 
            className="bg-[#111318] w-full rounded-t-3xl border-t border-white/10 p-6 pb-24 animate-in slide-in-from-bottom-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">More Options</h3>
              <button onClick={() => setMobileMoreOpen(false)} className="text-gray-400 bg-white/5 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link to="/dashboard/profile" onClick={() => setMobileMoreOpen(false)} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-white hover:bg-white/10">
                <User size={18} className="text-[#F97316]" /> Profile
              </Link>
              {secondaryNav.map(({ label, to, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMobileMoreOpen(false)} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-white hover:bg-white/10">
                  <Icon size={18} className="text-[#F97316]" /> {label}
                </Link>
              ))}
            </div>

            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
