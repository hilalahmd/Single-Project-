import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'

export default function TrainerPublicProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // MOCK DATA matching screenshot
  const t = {
    id,
    name: 'Alex Chen',
    role: 'Strength & Conditioning Coach',
    rating: 4.9,
    clients: 342,
    experience: '8 years',
    response: '< 2 hours',
    languages: ['English', 'Mandarin'],
    specialties: ['HIIT', 'Strength', 'Weight Loss'],
    bio: 'Former competitive powerlifter turned coach with 8+ years helping clients achieve sustainable transformation. My approach combines evidence-based programming with habit coaching for lasting results.',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    availability: [
      { day: 'Mon', times: ['11:00'] },
      { day: 'Tue', times: ['9:00', '11:00'] },
      { day: 'Wed', times: ['9:00', '11:00'] },
      { day: 'Thu', times: ['11:00'] },
      { day: 'Fri', times: ['9:00'] },
      { day: 'Sat', times: ['9:00', '11:00'] },
      { day: 'Sun', times: ['11:00'] },
    ]
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      {/* ── Top Nav Header (Mocked for visual completeness) ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-black tracking-tight">FitForge</span>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/trainers')} className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-1">
              <ArrowLeft size={14} /> Coaches
            </button>
            <button className="px-5 py-2 bg-black text-white rounded-xl text-sm font-bold shadow-sm">
              Get started
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-12">
        {/* ── Hero & Header Section ── */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl mb-8 shadow-sm overflow-hidden">
          
          {/* Hero Banner */}
          <div className="h-64 w-full bg-gray-200 relative">
            <img 
              src={t.heroImage} 
              alt="Gym Equipment" 
              className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80"
            />
            {/* The screenshot had a very contrasty b&w image for hero */}
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar Overlap */}
            <div className="flex justify-between items-end mb-6">
              <div className="-mt-14 relative z-10 flex items-end gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                />
              </div>
              <button className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors">
                Book session
              </button>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h1 className="text-3xl font-bold text-black">{t.name}</h1>
                <ShieldCheck size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {t.role}
              </p>
            </div>

          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid lg:grid-cols-3 gap-8 px-4 sm:px-0">
          
          {/* Left Column (Stats & About) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-black text-lg">{t.experience}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Experience</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-black text-lg">{t.clients}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Clients</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-black text-lg">{t.rating}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Rating</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-black text-lg">{t.response}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Response</div>
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-4">About</h2>
              <p className="text-gray-500 leading-relaxed font-medium mb-8">
                {t.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {[...t.specialties, ...t.languages].map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-6">Availability</h2>
              <div className="grid grid-cols-7 gap-2 text-center">
                {t.availability.map((day, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">{day.day}</span>
                    {day.times.includes('9:00') ? (
                      <div className="py-2 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-md">9:00</div>
                    ) : <div className="py-2 bg-gray-50 rounded-md"></div>}
                    {day.times.includes('11:00') ? (
                      <div className="py-2 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-md">11:00</div>
                    ) : <div className="py-2 bg-gray-50 rounded-md"></div>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Pricing) */}
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-black mb-1">Wellness</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-black">$89</span>
                <span className="text-gray-400 text-sm font-medium"> /mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> 2 sessions/month
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> Nutrition guidance
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> Progress tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> Chat support
                </li>
              </ul>
              <button className="w-full py-3 border border-gray-200 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition-colors">
                Subscribe
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-black mb-1">Personal Training</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-black">$129</span>
                <span className="text-gray-400 text-sm font-medium"> /mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> 4 sessions/month
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> Custom workout plan
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> Nutrition guidance
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Check size={16} className="text-gray-400" /> Chat support
                </li>
              </ul>
              <button className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
