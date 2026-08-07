import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, ShieldCheck, Star, ChevronDown, Activity, Users, Filter, CheckCircle2 } from 'lucide-react'
import API from '../../../shared/utils/api'

const FILTER_TAGS = ['All', 'Wellness', 'HIIT', 'Strength', 'Yoga', 'Boxing', 'CrossFit', 'Running']

export default function TrainerListingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const gridRef = useRef(null)

  const [activeTag, setActiveTag] = useState('All')
  const [coachType, setCoachType] = useState('trainer') // 'trainer' or 'wellness'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    language: 'Any language',
    price: 'Any price',
    rating: 'Any rating'
  })
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)  

  // Auto-filter to Wellness if arriving from ?type=wellness
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('type') === 'wellness') {
      setCoachType('wellness')
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [location.search])




  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()
        if (coachType) params.append('type', coachType)
        if (activeTag && activeTag !== 'All') params.append('tag', activeTag)
        if (searchQuery) params.append('search', searchQuery)
        if (selectedFilters.language && selectedFilters.language !== 'Any language') params.append('language', selectedFilters.language)
        if (selectedFilters.rating && selectedFilters.rating !== 'Any rating') params.append('rating', selectedFilters.rating)
        if (selectedFilters.price && selectedFilters.price !== 'Any price') params.append('priceSort', selectedFilters.price)

        const res = await fetch(`${API}/trainers?${params.toString()}`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to load trainers')
        const data = await res.json()

          const mapped = data.map(t => ({
            id: t._id,
            name: t.userId?.name || 'Unknown',
            role: t.role === 'wellness_coach' ? 'Wellness Coach' : 'Personal Trainer',
            languages: t.languagesSpoken || [],
            rating: t.rating || 0,
            reviews: t.reviewCount || 0,
            price: t.role === 'wellness_coach'
              ? t.pricing?.wellnessMonthly || 0
              : t.pricing?.personalTrainingMonthly || 0,
            tags: t.specialties || [],
            image: t.profilePhoto || t.userId?.avatar || 'https://via.placeholder.com/400x500'
          }))

        setTrainers(mapped)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchTrainers()
    }, 300) // Debounce for search input

    return () => clearTimeout(timer)
  }, [coachType, activeTag, searchQuery, selectedFilters])

  // Data is now professionally filtered and sorted by the Backend Aggregation Pipeline!
  const filteredTrainers = trainers

  return (
    <div className="relative min-h-screen bg-[#000000] overflow-hidden">
      {/* Ambient Orange Glow */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#ff6b1a]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* ── Hero Header Section ── */}
        <div className="flex flex-col items-center text-center mb-12 mt-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.3em] px-4.5 py-1.5 rounded-full shadow-lg mb-5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Expert Athletic & Wellness Directory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tighter font-['Syne'] uppercase">
            Find Your <span className="text-white border-b-2 border-white pb-1">Coach</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl font-medium mb-10 leading-relaxed">
            Connect with top-tier certified personal trainers & holistic wellness experts to transform your athletic potential.
          </p>

          {/* Segmented Control Pill Toggle (Black & White) */}
          <div className="bg-[#111111]/90 backdrop-blur-xl p-1.5 rounded-full border border-white/15 inline-flex shadow-2xl relative">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-48 sm:w-56 bg-white rounded-full shadow-[0_4px_25px_rgba(255,255,255,0.3)] transition-transform duration-300 ease-in-out ${
                coachType === 'wellness' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />

            <button
              onClick={() => {
                setCoachType('trainer')
                setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
              }}
              className={`relative z-10 flex items-center justify-center gap-2 w-48 sm:w-56 py-3.5 text-sm font-extrabold rounded-full transition-all duration-300 cursor-pointer ${
                coachType === 'trainer' ? 'text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={18} className={coachType === 'trainer' ? 'text-black' : 'text-gray-400'} />
              Personal Trainers
            </button>
            
            <button
              onClick={() => {
                setCoachType('wellness')
                setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
              }}
              className={`relative z-10 flex items-center justify-center gap-2 w-48 sm:w-56 py-3.5 text-sm font-extrabold rounded-full transition-all duration-300 cursor-pointer ${
                coachType === 'wellness' ? 'text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity size={18} className={coachType === 'wellness' ? 'text-black' : 'text-gray-400'} />
              Wellness Coaches
            </button>
          </div>
        </div>

        {/* ── Search & Filter Panel (Black & White) ── */}
        <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 mb-10 shadow-2xl relative z-20">
          
          {/* Search Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or discipline..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all font-medium"
              />
            </div>
            
            {/* Filter Dropdowns */}
            <div className="flex gap-3 flex-wrap shrink-0">
              {[
                { keyName: 'language', label: 'Any language', options: ['English', 'Malayalam', 'Any language'] },
                { keyName: 'price', label: 'Any price', options: ['Low to High', 'High to Low', 'Any price'] },
                { keyName: 'rating', label: 'Any rating', options: ['4.0+ Stars', '4.5+ Stars', '5.0 Stars', 'Any rating'] }
              ].map((filter, i) => (
                <div key={i} className="relative group shrink-0">
                  <button className={`px-5 py-4 border rounded-2xl text-sm bg-white/5 focus:outline-none focus:border-white flex items-center gap-2.5 transition-all font-medium cursor-pointer ${
                    selectedFilters[filter.keyName] !== filter.label 
                    ? 'border-white text-white bg-white/10 font-bold' 
                    : 'border-white/15 text-white group-hover:border-white/40'
                  }`}>
                    <Filter size={15} className="text-white" />
                    <span>{selectedFilters[filter.keyName]}</span>
                    <ChevronDown size={16} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  {/* Dropdown Options */}
                  <div className="absolute top-full left-0 mt-2 w-52 bg-[#111111] border border-white/20 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top group-hover:translate-y-0 -translate-y-2 overflow-hidden backdrop-blur-2xl">
                    <div className="py-2">
                      {filter.options.map((opt, j) => (
                        <button 
                          key={j} 
                          onClick={() => setSelectedFilters({...selectedFilters, [filter.keyName]: opt})}
                          className={`w-full text-left px-5 py-3 text-sm transition-colors font-medium cursor-pointer flex items-center justify-between ${
                            selectedFilters[filter.keyName] === opt 
                            ? 'text-white bg-white/15 font-bold' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedFilters[filter.keyName] === opt && <CheckCircle2 size={14} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tag Pills Row (Black & White) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide pt-1">
            {FILTER_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeTag === tag
                    ? 'bg-white text-black font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.25)]'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/15'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Coach Cards Grid (Black & White Luxury) ── */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-[#0a0a0a] rounded-3xl border border-white/10 h-[480px] animate-pulse p-6 flex flex-col justify-between">
                <div className="w-full h-56 bg-white/5 rounded-2xl mb-4"></div>
                <div className="h-6 bg-white/5 rounded-md w-3/4 mb-3"></div>
                <div className="h-4 bg-white/5 rounded-md w-1/2 mb-4"></div>
                <div className="h-10 bg-white/5 rounded-xl w-full"></div>
              </div>
            ))
          ) : filteredTrainers.length > 0 ? (
            filteredTrainers.map(t => (
              <div 
                key={t.id} 
                className="bg-[#0a0a0a] rounded-3xl border border-white/15 overflow-hidden flex flex-col group shadow-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)] hover:border-white/40 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative"
              >
                {/* Subtle Card Header Shine */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none"></div>

                {/* Hero Photo Container */}
                <div className="relative h-64 bg-black overflow-hidden">
                  <img 
                    src={t.image} 
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                  />
                  {/* Overlay Gradient for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
                  
                  {/* Monochrome Rating Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/20">
                    <Star size={14} className="fill-white text-white" />
                    <span className="text-xs font-bold text-white">{t.rating || '5.0'}</span>
                    {t.reviews > 0 && <span className="text-[10px] text-gray-400 font-medium">({t.reviews})</span>}
                  </div>
                  
                  {/* Name Over Image */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-black text-white font-['Syne'] uppercase tracking-tight truncate">{t.name}</h2>
                      <ShieldCheck size={20} className="text-white shrink-0" />
                    </div>
                    <p className="text-xs text-gray-300 font-medium">
                      {(t.languages || ['English']).join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                  
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">
                    {t.role}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(t.tags?.length ? t.tags : ['Strength', 'Nutrition']).slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 text-gray-300 text-xs font-bold rounded-full border border-white/15 group-hover:border-white/40 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Row */}
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/10">
                    <div>
                      <span className="font-black text-2xl text-white font-['Syne']">₹{t.price || 2999}</span>
                      <span className="text-xs text-gray-400 font-medium"> / mo</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => navigate(`/trainers/${t.id}`)}
                        className="px-4 py-2.5 border border-white/20 rounded-xl text-xs font-bold text-white hover:border-white/50 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => navigate(`/plans?trainerId=${t.id}`)}
                        className="px-5 py-2.5 bg-white hover:bg-gray-200 rounded-xl text-xs font-extrabold text-black shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer uppercase tracking-wider"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/15 text-center shadow-2xl">
              <Search size={48} className="text-gray-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white font-['Syne'] mb-2">No Coaches Found</h3>
              <p className="text-gray-400 text-sm max-w-md font-medium mb-6">
                We couldn't find any coaches matching your filter criteria. Try adjusting your tags or search query.
              </p>
              <button 
                onClick={() => {
                  setActiveTag('All')
                  setSearchQuery('')
                  setSelectedFilters({ language: 'Any language', price: 'Any price', rating: 'Any rating' })
                }} 
                className="px-8 py-3.5 bg-white text-black text-xs font-extrabold uppercase tracking-wider rounded-full shadow-[0_4px_25px_rgba(255,255,255,0.3)] hover:bg-gray-200 transition-all cursor-pointer"
              >
                Reset Filters & Show All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
