import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const getNavLinks = (user, role, subscriptionTier) => {
  if (user && role === 'user') {
    return [
      { label: 'Home', to: '/' },
      { label: 'Today', to: '/dashboard' },
      { label: 'Plan', to: '/dashboard/plans' },
      { label: 'Coach', to: '/dashboard/coach' },
      { label: 'Nutrition', to: '/dashboard/nutrition' },
      { label: 'Food AI', to: '/dashboard/food-ai' },
      { label: 'Progress', to: '/dashboard/progress' }
    ]
  }

  // Not logged in, or not a client role (trainers/admins might still have their own sidebar dashboard)
  return [
    { label: 'Home', to: '/' },
    { label: 'Find Coach', to: '/trainers' },
    { label: 'Plans',  to: '/plans' },
    { label: 'Nutrition', to: '/free-diet-plan' },
  ]
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, subscriptionTier, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Ensure navbar is visible when navigating to a new page
    setHidden(false)
  }, [location.pathname])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      // Don't apply scroll logic on home page since it uses slides now
      if (window.location.pathname === '/') return;

      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      
      lastScrollY = currentScrollY
      setScrolled(currentScrollY > 20)
    }

    const handleSlideChange = (e) => {
      if (e.detail?.slideIndex > 0) {
        setHidden(true)
      } else {
        setHidden(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('landingSlideChange', handleSlideChange)
    
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('landingSlideChange', handleSlideChange)
    }
  }, [])

  const isHome = location.pathname === '/'

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${hidden ? '-translate-y-full' : 'translate-y-0'} ${
      isHome 
        ? 'bg-transparent border-transparent' 
        : 'bg-[#07080C] border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-black tracking-[-0.05em] font-['Syne'] transition-colors duration-300 text-white`}
          >
            FITFORGE
          </Link>

          {/* Center: Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-6 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {getNavLinks(user, role, subscriptionTier).map(({ label, to }, index, arr) => (
              <div key={to} className="flex items-center gap-6">
                <NavLink
                  to={to}
                  end={to === '/dashboard' || to === '/'}
                  className={({ isActive }) =>
                    `text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity duration-300 
                     ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'} 
                     text-white`
                  }
                >
                  {label}
                </NavLink>
                {index < arr.length - 1 && (
                  <span className={`text-[10px] font-light transition-colors duration-300 text-white/30`}>+</span>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: Actions + Profile */}
          <div className="hidden md:flex items-center justify-end gap-6 flex-1">

            {user ? (
              <button
                onClick={() => {
                  const dashboardUrl = role === 'admin' ? '/admin' : role === 'user' ? '/dashboard' : '/trainer/dashboard'
                  navigate(dashboardUrl)
                }}
                className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity duration-300 opacity-80 hover:opacity-100 cursor-pointer text-white`}
              >
                DASHBOARD
              </button>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity duration-300 opacity-60 hover:opacity-100 text-white`}
                >
                  LOG IN
                </Link>

                <button
                  onClick={() => navigate('/auth/register')}
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity duration-300 opacity-100 hover:opacity-70 cursor-pointer text-white`}
                >
                  GET STARTED
                </button>
              </>
            )}

            {/* Profile avatar — only when logged in */}
            {user && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-transparent transition-opacity duration-300 opacity-60 hover:opacity-100 cursor-pointer text-white`}
                  title="My Profile"
                >
                  <User size={16} />
                </button>

                {profileOpen && (
                  <div className={`absolute top-[120%] right-0 w-56 border rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-4 z-50 ${isHome ? 'bg-[#111318] border-white/10 text-white' : 'bg-white border-gray-100 text-[#0F172A]'}`}>
                    <div className={`px-4 py-3 border-b mb-2 ${isHome ? 'border-white/10' : 'border-gray-100'}`}>
                      <p className="font-bold truncate">{user?.name || 'User'}</p>
                      <p className={`text-xs truncate ${isHome ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                    </div>
                    
                    <Link
                      to={role === 'trainer' || role === 'wellness_coach' ? '/trainer/profile' : role === 'admin' ? '/admin' : '/dashboard/profile'}
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isHome ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50'}`}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    {role !== 'user' && (
                      <button onClick={() => {
                        setProfileOpen(false);
                        const dashboardUrl = role === 'admin' ? '/admin' : '/trainer/dashboard';
                        navigate(dashboardUrl)
                      }} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isHome ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-[#0F172A] hover:bg-gray-50'}`}>
                        Dashboard
                      </button>
                    )}
                    
                    <div className={`h-px my-2 ${isHome ? 'bg-white/10' : 'bg-gray-100'}`} />
                    
                    <button onClick={async () => {
                      setProfileOpen(false);
                      await logout();
                      navigate('/');
                    }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-500 hover:bg-red-400/10 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="ml-auto md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 transition-colors duration-300 text-white`}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
         <div className={`md:hidden absolute top-full left-0 w-full p-4 flex flex-col gap-4 border-b ${isHome ? 'bg-[#07080C] border-white/10' : 'bg-white shadow-sm border-gray-100'}`}>
            {/* Nav Links */}
            {getNavLinks(user, role, subscriptionTier).map(({ label, to }) => (
               <NavLink 
                 key={to} 
                 to={to} 
                 onClick={() => setMenuOpen(false)} 
                 className={({ isActive }) => `text-sm font-bold uppercase tracking-widest ${isActive ? 'text-[#F97316]' : `${isHome ? 'text-gray-300 hover:text-white' : 'text-[#64748B] hover:text-[#F97316]'}`}`}
               >
                 {label}
               </NavLink>
            ))}
            <hr className={isHome ? 'border-white/10' : 'border-gray-100'} />
            

            
            {user ? (
              role === 'user' ? (
                <button 
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/dashboard')
                  }} 
                  className="bg-[#F97316] text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] text-center py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors duration-200 cursor-pointer"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setMenuOpen(false)
                    const dashboardUrl = role === 'admin' ? '/admin' : '/trainer/dashboard'
                    navigate(dashboardUrl)
                  }} 
                  className="bg-[#F97316] text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] text-center py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors duration-200 cursor-pointer"
                >
                  Dashboard
                </button>
              )
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest ${isHome ? 'text-gray-300 hover:text-white' : 'text-[#64748B] hover:text-[#F97316]'}`}>
                  Log in
                </Link>
                <button onClick={() => { setMenuOpen(false); navigate('/auth/register'); }} className="bg-[#F97316] text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] text-center py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors duration-200 cursor-pointer">
                  Get Started
                </button>
              </>
            )}
         </div>
      )}
    </header>
  )
}
