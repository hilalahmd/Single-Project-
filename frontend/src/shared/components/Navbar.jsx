import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Find Coach', to: '/trainers' },
  { label: 'Plans',      to: '/plans' },
  { label: 'Free Diet',  to: '/free-diet-plan' },
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

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-[#07080C]/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black tracking-[-0.05em] text-white font-['Syne'] drop-shadow-md"
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
                    `relative py-1 text-[11px] font-bold uppercase tracking-widest transition-colors drop-shadow-md 
                     after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white 
                     after:rounded-full after:origin-center after:transition-transform after:duration-300 
                     ${isActive ? 'text-white after:scale-x-100' : 'text-white/80 hover:text-white after:scale-x-0 hover:after:scale-x-100 hover:after:bg-white/50'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/auth/login"
              className="text-xs font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest drop-shadow-md"
            >
              Log in
            </Link>

            <button
              onClick={() => navigate('/auth/register')}
              className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-xs hover:scale-105 transition-transform uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              GET STARTED
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="ml-auto md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
         <div className="md:hidden bg-[#07080C] border-b border-white/10 absolute top-full left-0 w-full p-4 flex flex-col gap-4">
            {/* Nav Links */}
            {navLinks.map(({ label, to }) => (
               <NavLink 
                 key={to} 
                 to={to} 
                 onClick={() => setMenuOpen(false)} 
                 className={({ isActive }) => `text-sm font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/80 hover:text-white'}`}
               >
                 {label}
               </NavLink>
            ))}
            <hr className="border-white/10" />
            <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white">
              Log in
            </Link>
            <button onClick={() => { setMenuOpen(false); navigate('/auth/register'); }} className="bg-white text-black text-center py-3 rounded-full font-bold text-xs uppercase tracking-wider">
              Get Started
            </button>
         </div>
      )}
    </header>
  )
}
