import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Scale, Percent, Activity } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function ClientProgressDashboardPage() {
  const { clientId } = useParams()
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [clientInfo, setClientInfo] = useState({ name: 'Client' })

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API}/progress/${clientId}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setHistory(data.history)
        } else {
          setError(data.message)
        }
        
        // Fetch client details
        const clientRes = await fetch(`${API}/users/${clientId}`, { credentials: 'include' })
        const clientData = await clientRes.json()
        if (clientData.success) {
          setClientInfo(clientData.data)
        }
      } catch (err) {
        setError('Failed to fetch client progress.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProgress()
  }, [clientId])

  if (isLoading) return <div className="min-h-screen bg-[#07080C] text-white flex items-center justify-center">Loading Analytics...</div>
  if (error) return <div className="min-h-screen bg-[#07080C] text-red-500 flex items-center justify-center">{error}</div>

  const latestLog = history.length > 0 ? history[history.length - 1] : null
  const firstLog = history.length > 0 ? history[0] : null
  
  const weightChange = (latestLog?.weight && firstLog?.weight) ? (latestLog.weight - firstLog.weight).toFixed(1) : 0
  const bodyFatChange = (latestLog?.bodyFat && firstLog?.bodyFat) ? (latestLog.bodyFat - firstLog.bodyFat).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-[#07080C] text-white p-8 font-['Inter']">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/trainer/clients" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight">{clientInfo.name}'s Analytics</h1>
            <p className="text-gray-400 font-medium">Tracking progress, measurements, and progressive overload</p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#11131A] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b1a]/10 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Current Weight</p>
                <h3 className="text-4xl font-black">{latestLog?.weight || '--'} <span className="text-xl text-gray-500">kg</span></h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#ff6b1a]/10 flex items-center justify-center text-[#ff6b1a]">
                <Scale size={24} />
              </div>
            </div>
            {weightChange !== 0 && (
              <p className={`text-sm font-bold ${weightChange > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {weightChange > 0 ? '+' : ''}{weightChange} kg from start
              </p>
            )}
          </div>

          <div className="bg-[#11131A] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Body Fat %</p>
                <h3 className="text-4xl font-black">{latestLog?.bodyFat || '--'} <span className="text-xl text-gray-500">%</span></h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Percent size={24} />
              </div>
            </div>
            {bodyFatChange !== 0 && (
              <p className={`text-sm font-bold ${bodyFatChange > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {bodyFatChange > 0 ? '+' : ''}{bodyFatChange} % from start
              </p>
            )}
          </div>

          <div className="bg-[#11131A] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Logs</p>
                <h3 className="text-4xl font-black">{history.length} <span className="text-xl text-gray-500">entries</span></h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Activity size={24} />
              </div>
            </div>
            <p className="text-sm font-bold text-gray-500">Consistent tracking over time</p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-[#11131A] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
            <h2 className="text-xl font-bold flex items-center gap-2"><TrendingUp size={20} className="text-[#ff6b1a]"/> Detailed Progress Logs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.02)]">
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-[rgba(255,255,255,0.05)]">Date</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-[rgba(255,255,255,0.05)]">Weight</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-[rgba(255,255,255,0.05)]">Body Fat</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-[rgba(255,255,255,0.05)]">Measurements</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-[rgba(255,255,255,0.05)]">Strength (Progressive Overload)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log, index) => (
                  <tr key={index} className="border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                    <td className="p-4 font-medium">{new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="p-4 font-bold text-white">{log.weight ? `${log.weight} kg` : '--'}</td>
                    <td className="p-4 font-bold text-white">{log.bodyFat ? `${log.bodyFat} %` : '--'}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {log.measurements ? (
                        <div className="flex gap-3 flex-wrap max-w-xs">
                          {log.measurements.chest && <span>Chest: {log.measurements.chest}</span>}
                          {log.measurements.waist && <span>Waist: {log.measurements.waist}</span>}
                          {log.measurements.arm && <span>Arm: {log.measurements.arm}</span>}
                        </div>
                      ) : '--'}
                    </td>
                    <td className="p-4 text-sm">
                      {log.strengthLogs && log.strengthLogs.length > 0 ? (
                        <div className="space-y-1">
                          {log.strengthLogs.map((s, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <span className="font-bold text-[#C4F135]">{s.exercise}:</span>
                              <span>{s.weight}kg x {s.reps} ({s.sets} sets)</span>
                            </div>
                          ))}
                        </div>
                      ) : '--'}
                    </td>
                  </tr>
                )).reverse()}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="p-12 text-center text-gray-500 font-medium">No progress logs found for this client.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
