import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function TrainerPublicProfilePage() {

const { id } = useParams()
  const navigate = useNavigate()

  const [t, setT] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API}/trainers/${id}`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to load trainer')
        const data = await res.json()

        setT({
          id: data._id,
          name: data.userId?.name || 'Unknown',
          role: data.role === 'wellness_coach' ? 'Wellness Coach' : 'Personal Trainer',
          rating: data.rating || 0,
          clients: data.clientsCount || 0,
          experience: data.experience ? `${data.experience} yrs` : 'N/A',
          response: '98%',
          languages: data.languagesSpoken || [],
          specialties: data.specialties || [],
          bio: data.bio || 'No bio added yet.',
          heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          avatar: data.profilePhoto || data.userId?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.userId?.name || 'Trainer') + '&size=200&background=1a1a1a&color=ff6b1a',
          wellnessPrice: data.pricing?.wellnessMonthly || 0,
          personalPrice: data.pricing?.personalTrainingMonthly || 0,
          availability: data.availability || [
            { day: 'Mon', times: ['9:00', '11:00'] },
            { day: 'Tue', times: ['9:00'] },
            { day: 'Wed', times: ['11:00'] },
            { day: 'Thu', times: ['9:00', '11:00'] },
            { day: 'Fri', times: ['9:00'] },
            { day: 'Sat', times: [] },
            { day: 'Sun', times: [] }
          ]
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainer()
  }, [id])



  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080C] text-white flex items-center justify-center font-['Inter']">
        <p className="text-gray-400 text-lg">Loading trainer...</p>
      </div>
    )
  }

  if (error || !t) {
    return (
      <div className="min-h-screen bg-[#07080C] text-white flex items-center justify-center font-['Inter']">
        <p className="text-red-400 text-lg">{error || 'Trainer not found'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-white font-['Inter'] selection:bg-[#F97316] relative overflow-hidden">
      {/* Ambient Orange Glow */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ── Top Nav Header ── */}
      <div className="bg-[#0f1117]/80 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-white tracking-tight font-['Syne']">FITFORGE</span>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/trainers')} className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={16} /> Back to Coaches
            </button>
            <button 
              onClick={() => navigate(`/plans?trainerId=${t.id}`)}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(249,115,22,0.35)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
            >
              Get started
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-12 mt-6 relative z-10 px-4 sm:px-6">
        {/* ── Hero & Header Section ── */}
        <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl mb-8 shadow-xl overflow-hidden">
          
          {/* Hero Banner */}
          <div className="h-64 w-full bg-[#07080C] relative border-b border-white/10">
            <img 
              src={t.heroImage} 
              alt="Gym Equipment" 
              loading="lazy"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent"></div>
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar Overlap */}
            <div className="flex justify-between items-end mb-6">
              <div className="-mt-14 relative z-10 flex items-end gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  loading="lazy"
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-[#0f1117] shadow-2xl bg-white/5"
                />
              </div>
              <button 
                onClick={() => navigate(`/plans?trainerId=${t.id}`)}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(249,115,22,0.35)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
              >
                Book session
              </button>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-white font-['Syne'] uppercase">{t.name}</h1>
                <ShieldCheck size={22} className="text-orange-400" />
              </div>
              <p className="text-orange-400 font-bold uppercase tracking-wider text-sm">
                {t.role}
              </p>
            </div>

          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column (Stats & About) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
                <div className="font-black text-white text-xl font-['Syne']">{t.experience}</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Experience</div>
              </div>
              <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
                <div className="font-black text-white text-xl font-['Syne']">{t.clients}</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Clients</div>
              </div>
              <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
                <div className="font-black text-white text-xl font-['Syne'] flex justify-center items-center gap-1">
                  {t.rating} <span className="text-orange-400">★</span>
                </div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Rating</div>
              </div>
              <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
                <div className="font-black text-white text-xl font-['Syne']">{t.response}</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Response</div>
              </div>
            </div>

            {/* About Card */}
            <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 font-['Syne']">About</h2>
              <p className="text-gray-300 leading-relaxed font-medium mb-8">
                {t.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {[...t.specialties, ...t.languages].map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-white/5 text-gray-300 text-xs font-bold rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6 font-['Syne']">Availability</h2>
              <div className="grid grid-cols-7 gap-2 text-center">
                {t.availability.map((day, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{day.day}</span>
                    {day.times.includes('9:00') ? (
                      <div className="py-2 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-md">9:00</div>
                    ) : <div className="py-2 bg-white/5 rounded-md"></div>}
                    {day.times.includes('11:00') ? (
                      <div className="py-2 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-md">11:00</div>
                    ) : <div className="py-2 bg-white/5 rounded-md"></div>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Pricing) */}
          <div className="space-y-6">
            
            <div className="bg-[#0f1117]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full"></div>
              <h3 className="text-lg font-bold text-white mb-1 relative z-10">Wellness</h3>
              <div className="mb-6 relative z-10">
                <span className="text-3xl font-black text-white font-['Syne']">₹{t.wellnessPrice}</span>
                <span className="text-gray-400 text-sm font-medium"> /mo</span>
              </div>
              <ul className="space-y-3 mb-8 relative z-10">
                <li className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <Check size={16} className="text-orange-400" /> 2 sessions/month
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <Check size={16} className="text-orange-400" /> Nutrition guidance
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <Check size={16} className="text-orange-400" /> Progress tracking
                </li>
              </ul>
              <button 
                onClick={() => navigate(`/plans?trainerId=${t.id}`)}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer relative z-10"
              >
                Select plan
              </button>
            </div>

            <div className="bg-[#0f1117]/90 border border-orange-500 rounded-2xl p-6 shadow-[0_10px_30px_rgba(249,115,22,0.2)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full"></div>
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 shadow-md">
                Popular
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Personal Training</h3>
              <div className="mb-6">
                <span className="text-3xl font-black text-white font-['Syne']">₹{t.personalPrice}</span>
                <span className="text-gray-400 text-sm font-medium"> /mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                  <Check size={16} className="text-orange-400" /> 12 1-on-1 sessions
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                  <Check size={16} className="text-orange-400" /> Custom workout plan
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                  <Check size={16} className="text-orange-400" /> Daily check-ins
                </li>
              </ul>
              <button 
                onClick={() => navigate(`/plans?trainerId=${t.id}`)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(249,115,22,0.35)] transition-all cursor-pointer"
              >
                Select plan
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> Progress tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> Chat support
                </li>
              </ul>
              <button onClick={() => navigate(`/plans?trainerId=${id}`)} className="w-full py-3 border border-[#1E293B] rounded-xl text-sm font-bold text-white hover:bg-[#1E293B] transition-colors relative z-10">
                Subscribe
              </button>
            </div>

            <div className="bg-[#0F172A] border border-blue-500/50 rounded-2xl p-6 shadow-[0_0_20px_rgba(37,99,235,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <h3 className="text-lg font-bold text-white mb-1 relative z-10">Personal Training</h3>
              <div className="mb-6 relative z-10">
                <span className="text-3xl font-bold text-white">₹{t.personalPrice}</span>
                <span className="text-gray-500 text-sm font-medium"> /mo</span>
              </div>
              <ul className="space-y-3 mb-8 relative z-10">
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> 4 sessions/month
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> Custom workout plan
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> Nutrition guidance
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> Chat support
                </li>
              </ul>
              <button onClick={() => navigate(`/plans?trainerId=${id}`)} className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-colors relative z-10">
                Subscribe
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
