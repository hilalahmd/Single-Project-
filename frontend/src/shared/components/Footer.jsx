import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'About',    to: '/about' },
  { label: 'Trainers', to: '/trainers' },
  { label: 'Plans',    to: '/plans' },
  { label: 'Contact',  to: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#F5F4F0] text-[#1A1A1A] border-t border-[#E5E4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-12">
          {/* Brand */}
          <div className="space-y-2">
            <Link to="/" className="block text-xl font-bold tracking-tight text-[#1A1A1A]">
              FitForge
            </Link>
            <p className="text-sm text-gray-500 tracking-wide font-medium">
              Connect. Train. Transform.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E4E0]" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-5">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {year} FitForge. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 font-medium">
            Built for athletes, by athletes.
          </p>
        </div>
      </div>
    </footer>
  )
}
