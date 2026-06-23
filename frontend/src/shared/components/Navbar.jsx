import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Trainers', to: '/trainers' },
  { label: 'Plans',    to: '/plans' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-[#F5F4F0]/80 backdrop-blur-md border-b border-[#E5E4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-8">

          {/* Logo */}
          <Link to="/" className="shrink-0 text-lg font-bold tracking-tight text-[#1A1A1A]">
            FitForge
          </Link>

          {/* Center nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#1A1A1A] bg-black/5'
                      : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-black/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions (desktop) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              to="/auth/login"
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-[#1A1A1A] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-1.5 text-sm font-medium bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="ml-auto md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E5E4E0] bg-[#F5F4F0]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-black/5 text-[#1A1A1A]'
                      : 'text-gray-600 hover:bg-black/5 hover:text-[#1A1A1A]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="px-4 pb-4 flex flex-col gap-2">
            <Link
              to="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-2 text-sm font-medium text-[#1A1A1A] border border-[#E5E4E0] rounded-lg hover:bg-white transition-colors bg-white shadow-sm"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-2 text-sm font-medium bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2D2D2D] transition-colors shadow-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
