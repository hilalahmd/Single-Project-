import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Activity, TrendingDown, TrendingUp, Plus } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'

export default function ProgressPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  
  const [showLogModal, setShowLogModal] = useState(false)
  const [newWeight, setNewWeight] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/users/profile`, { credentials: 'include' })
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogWeight = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API}/users/weight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ weight: Number(newWeight) })
      })
      if (res.ok) {
        setNewWeight('')
        setShowLogModal(false)
        fetchProfile()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const weightHistory = profile?.weightHistory || []
  
  // Custom SVG Chart Data Processing
  const hasHistory = weightHistory.length > 0
  let chartPoints = ""
  let minWeight = 0
  let maxWeight = 100
  let latestWeight = profile?.bodyMetrics?.weight || 0
  let startWeight = latestWeight
  let trend = 0

  if (hasHistory) {
    const weights = weightHistory.map(w => w.weight)
    minWeight = Math.min(...weights) - 5
    maxWeight = Math.max(...weights) + 5
    startWeight = weightHistory[0].weight
    latestWeight = weightHistory[weightHistory.length - 1].weight
    trend = latestWeight - startWeight

    const chartWidth = 800
    const chartHeight = 200
    const xStep = weightHistory.length > 1 ? chartWidth / (weightHistory.length - 1) : chartWidth
    
    chartPoints = weightHistory.map((entry, index) => {
      const x = index * xStep
      const y = chartHeight - ((entry.weight - minWeight) / (maxWeight - minWeight)) * chartHeight
      return `${x},${y}`
    }).join(" ")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-black text-white tracking-tight font-['Syne']">Progress Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Track your weight and fitness journey.</p>
        </div>
        <button 
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-black transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b', boxShadow: '0 4px 16px rgba(196,241,53,0.2)' }}
        >
          <Plus size={16} />
          Log Today's Weight
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">Loading analytics...</div>
      ) : (
        <div className="space-y-6 relative z-10">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#111318] shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#C4F135]/10 rounded-xl text-[#C4F135]">
                  <Activity size={20} />
                </div>
                <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Current Weight</h3>
              </div>
              <div className="text-4xl font-black text-white font-['Syne']">{latestWeight} <span className="text-lg text-gray-500">kg</span></div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#111318] shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Target size={20} />
                </div>
                <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Target Weight</h3>
              </div>
              <div className="text-4xl font-black text-white font-['Syne']">{profile?.bodyMetrics?.calorieTarget ? (latestWeight - 5) : 'N/A'} <span className="text-lg text-gray-500">kg</span></div>
              <p className="text-xs text-gray-500 mt-2">Based on your goals</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#111318] shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${trend <= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {trend <= 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                </div>
                <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Overall Trend</h3>
              </div>
              <div className="text-4xl font-black text-white font-['Syne']">
                {trend > 0 ? '+' : ''}{trend.toFixed(1)} <span className="text-lg text-gray-500">kg</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Since starting</p>
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="p-6 md:p-8 rounded-[24px] border border-white/10 shadow-2xl relative overflow-hidden"
               style={{ background: 'linear-gradient(180deg, #111318 0%, #0a0a0b 100%)' }}>
            
            <h2 className="text-lg font-bold text-white mb-8 font-['Syne']">Weight History</h2>
            
            {!hasHistory ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                Log your weight to see your progress chart!
              </div>
            ) : (
              <div className="relative w-full overflow-x-auto pb-4">
                <div className="min-w-[600px] h-[250px] relative">
                  {/* Y-Axis Labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500 font-bold pr-4 py-2 border-r border-white/10">
                    <span>{maxWeight}</span>
                    <span>{Math.round((maxWeight + minWeight) / 2)}</span>
                    <span>{minWeight}</span>
                  </div>

                  {/* Chart Area */}
                  <div className="absolute left-10 right-0 top-0 bottom-0 py-2">
                    {/* Grid Lines */}
                    <div className="absolute top-2 w-full border-t border-white/5"></div>
                    <div className="absolute top-1/2 w-full border-t border-white/5"></div>
                    <div className="absolute bottom-2 w-full border-t border-white/5"></div>
                    
                    <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none" className="overflow-visible">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#C4F135" />
                          <stop offset="100%" stopColor="#4ADE80" />
                        </linearGradient>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C4F135" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#C4F135" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Area Fill */}
                      <polygon points={`0,200 ${chartPoints} 800,200`} fill="url(#areaGrad)" />
                      
                      {/* Line */}
                      <polyline
                        points={chartPoints}
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Points */}
                      {weightHistory.map((entry, index) => {
                        const xStep = weightHistory.length > 1 ? 800 / (weightHistory.length - 1) : 800
                        const x = index * xStep
                        const y = 200 - ((entry.weight - minWeight) / (maxWeight - minWeight)) * 200
                        return (
                          <g key={index}>
                            <circle cx={x} cy={y} r="4" fill="#111318" stroke="#C4F135" strokeWidth="2" />
                            <text x={x} y={y - 15} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">
                              {entry.weight}
                            </text>
                            <text x={x} y={220} fill="#6b7280" fontSize="10" textAnchor="middle">
                              {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </text>
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Log Weight Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111318] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6"
          >
            <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">Log Today's Weight</h3>
            <p className="text-sm text-gray-400 mb-6">Keep track of your progress consistently.</p>
            
            <form onSubmit={handleLogWeight} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#C4F135] text-xl font-bold text-center"
                    placeholder="75.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">kg</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: '#C4F135', color: '#0a0a0b' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Log'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  )
}
