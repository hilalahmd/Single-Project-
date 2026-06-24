import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout() {
  const location = useLocation()
  
  // If we're on the home page, the content should flow under the transparent navbar.
  // For all other pages, we add top padding so the fixed navbar doesn't cover content.
  const isHome = location.pathname === '/'

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white">
      <Navbar />
      <main className={`flex-1 ${!isHome ? 'pt-20' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
