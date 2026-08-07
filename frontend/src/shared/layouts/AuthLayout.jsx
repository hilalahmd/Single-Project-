import { Outlet, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function AuthLayout() {
  const { theme } = useTheme()
  const themeClass = theme === 'light' ? 'theme-light' : 'theme-dark'

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 text-white font-['Inter'] selection:bg-white selection:text-black">
      {/* Background styling matching FreeDietPlanPage */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 blur-[160px] rounded-full pointer-events-none z-10"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-black tracking-tight text-white font-['Syne'] uppercase">
              FITFORGE
            </span>
          </Link>
          <p className="mt-2 text-xs text-gray-400 tracking-[0.25em] uppercase font-bold">
            Connect · Train · Transform
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0a0a0a] backdrop-blur-2xl border border-white/15 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
          {/* Glossy highlight effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
