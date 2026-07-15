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
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading trainer...</p>
      </div>
    )
  }

  if (error || !t) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <p className="text-red-400 text-lg">{error || 'Trainer not found'}</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#030712]">
      
      {/* ── Top Nav Header ── */}
      <div className="bg-[#0F172A] border-b border-[#1E293B]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-white tracking-tight">FITFORGE</span>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/trainers')} className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Coaches
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-colors">
              Get started
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pb-12 mt-6">
        {/* ── Hero & Header Section ── */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl mb-8 shadow-sm overflow-hidden">
          
          {/* Hero Banner */}
          <div className="h-64 w-full bg-[#111827] relative border-b border-[#1E293B]">
            <img 
              src={t.heroImage} 
              alt="Gym Equipment" 
              loading="lazy"
              className="w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar Overlap */}
            <div className="flex justify-between items-end mb-6">
              <div className="-mt-14 relative z-10 flex items-end gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  loading="lazy"
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-[#0F172A] shadow-xl bg-[#111827]"
                />
              </div>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-colors">
                Book session
              </button>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h1 className="text-3xl font-bold text-white">{t.name}</h1>
                <ShieldCheck size={20} className="text-blue-500" />
              </div>
              <p className="text-blue-400 font-medium">
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
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-white text-lg">{t.experience}</div>
                <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Experience</div>
              </div>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-white text-lg">{t.clients}</div>
                <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Clients</div>
              </div>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-white text-lg flex justify-center items-center gap-1">
                  {t.rating} <ShieldCheck size={14} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Rating</div>
              </div>
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 text-center shadow-sm">
                <div className="font-bold text-white text-lg">{t.response}</div>
                <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">Response</div>
              </div>
            </div>

            {/* About Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-400 leading-relaxed font-medium mb-8">
                {t.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {[...t.specialties, ...t.languages].map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-[#1E293B] text-gray-300 text-xs font-bold rounded-full border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-white mb-6">Availability</h2>
              <div className="grid grid-cols-7 gap-2 text-center">
                {t.availability.map((day, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{day.day}</span>
                    {day.times.includes('9:00') ? (
                      <div className="py-2 text-[10px] font-bold text-blue-400 bg-blue-600/10 border border-blue-500/20 rounded-md">9:00</div>
                    ) : <div className="py-2 bg-[#1E293B]/50 rounded-md"></div>}
                    {day.times.includes('11:00') ? (
                      <div className="py-2 text-[10px] font-bold text-blue-400 bg-blue-600/10 border border-blue-500/20 rounded-md">11:00</div>
                    ) : <div className="py-2 bg-[#1E293B]/50 rounded-md"></div>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Pricing) */}
          <div className="space-y-6">
            
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
              <h3 className="text-lg font-bold text-white mb-1 relative z-10">Wellness</h3>
              <div className="mb-6 relative z-10">
                <span className="text-3xl font-bold text-white">₹{t.wellnessPrice}</span>
                <span className="text-gray-500 text-sm font-medium"> /mo</span>
              </div>
              <ul className="space-y-3 mb-8 relative z-10">
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> 2 sessions/month
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <Check size={16} className="text-blue-500" /> Nutrition guidance
                </li>
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
