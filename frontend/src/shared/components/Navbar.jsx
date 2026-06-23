import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Trainers', to: '/trainers' },
  { label: 'Plans',    to: '/plans' },
  { label: 'Free Diet', to: '/free-diet-plan' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-[#07080C]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          {/* Logo — Syne font matching CinematicHero */}
          <Link
            to="/"
            className="shrink-0 text-xl font-[800] tracking-[-0.02em] text-white font-['Syne']"
          >
            FITFORGE
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-[600] font-['Inter'] rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to="/auth/login"
              className="px-4 py-2 text-sm font-[700] font-['Syne'] text-gray-300 hover:text-white transition-colors tracking-wide uppercase"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="
                px-5 py-2 text-sm font-[800] font-['Syne'] uppercase tracking-[0.05em]
                bg-[#2563EB] text-white rounded-full
                hover:bg-white hover:text-[#2563EB]
                shadow-[0_0_20px_rgba(37,99,235,0.4)]
                hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]
                transition-all duration-300 hover:scale-105
              "
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="ml-auto md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#07080C]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-[600] rounded-xl transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="px-4 pb-5 flex flex-col gap-2">
            <Link
              to="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-2.5 text-sm font-[700] font-['Syne'] uppercase tracking-wide text-gray-300 border border-white/10 rounded-full hover:bg-white/5 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-2.5 text-sm font-[800] font-['Syne'] uppercase tracking-[0.05em] bg-[#2563EB] text-white rounded-full hover:bg-white hover:text-[#2563EB] transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
