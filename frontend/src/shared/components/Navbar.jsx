import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Find Coach', to: '/trainers' },
  { label: 'Plans',      to: '/plans' },
  { label: 'Diet',  to: '/free-diet-plan' },
  { label: 'Become a Coach', to: '/auth/trainer-register' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Init state
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = true // Always use home page theme for navbar

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isHome ? 'bg-[#07080C] border-b border-white/5' : 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-black tracking-[-0.05em] font-['Syne'] ${isHome ? 'text-white' : 'text-[#0F172A]'}`}
          >
            FITFORGE
          </Link>

          {/* Right side: Nav + Auth */}
          <div className="hidden md:flex items-center gap-6">
            
            <nav className="flex items-center gap-6 mr-2">
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative py-1 text-[11px] font-bold uppercase tracking-widest transition-colors 
                     after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F97316] 
                     after:rounded-full after:origin-center after:transition-transform after:duration-300 
                     ${isActive ? 'text-[#F97316] after:scale-x-100' : `${isHome ? 'text-gray-300' : 'text-[#64748B]'} hover:text-[#F97316] after:scale-x-0 hover:after:scale-x-100 hover:after:bg-[#F97316]`}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/auth/login"
              className={`text-xs font-bold transition-colors uppercase tracking-widest ${isHome ? 'text-gray-300 hover:text-white' : 'text-[#64748B] hover:text-[#F97316]'}`}
            >
              Log in
            </Link>

            <button
              onClick={() => navigate('/auth/register')}
              className="bg-[#F97316] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:bg-[#EA580C] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              GET STARTED
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="ml-auto md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 ${isHome ? 'text-white' : 'text-[#0F172A]'}`}
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
            {navLinks.map(({ label, to }) => (
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
            <Link to="/auth/login" onClick={() => setMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest ${isHome ? 'text-gray-300 hover:text-white' : 'text-[#64748B] hover:text-[#F97316]'}`}>
              Log in
            </Link>
            <button onClick={() => { setMenuOpen(false); navigate('/auth/register'); }} className="bg-[#F97316] text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)] text-center py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#EA580C] transition-colors duration-200 cursor-pointer">
              Get Started
            </button>
         </div>
      )}
    </header>
  )
}
