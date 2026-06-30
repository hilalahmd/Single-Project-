import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#07080C]/80 backdrop-blur-xl border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div>
            <span className="text-xl font-[800] tracking-[-0.02em] text-white font-['Syne']">
              FITFORGE
            </span>
            <p className="text-[0.6rem] text-[#F97316] font-[800] tracking-[0.3em] uppercase mt-1">
              Connect · Train · Transform
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {[
              { label: 'Trainers', to: '/trainers' },
              { label: 'Plans', to: '/plans' },
              { label: 'Diet', to: '/free-diet-plan' },
              { label: 'Login', to: '/auth/login' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-xs font-[600] text-gray-400 hover:text-[#F97316] transition-colors uppercase tracking-wider font-['Syne']"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-[#9CA3AF] font-['Inter']">
            © {new Date().getFullYear()} FitForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
