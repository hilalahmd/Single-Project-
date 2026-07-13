import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, ArrowDownToLine, Info } from 'lucide-react'
import API from '../../../shared/utils/api'


export default function EarningsPage() {
  const [earningsData, setEarningsData] = useState({
    thisMonth: 0,
    totalEarned: 0,
    pendingPayout: 0,
    history: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch(`${API}/trainers/earnings`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setEarningsData(data.earningsData)
          }
        }
      } catch (err) {
        console.error("Failed to load earnings", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEarnings()
  }, [])

   const handleExportCSV = () => {
    const headers = ['Month', 'Sessions', 'Gross Earnings ($)', 'Net Earnings ($)']
    const rows = earningsData.history.map(m => [m.month, m.sessions, m.gross, m.net])
    
    const csvRows = [headers.join(','), ...rows.map(e => e.join(','))]
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "FitForge_Earnings_Breakdown.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Earnings</h1>
          <p className="text-[14px] text-gray-400 mt-1">Track your revenue and upcoming payouts.</p>
        </div>
        <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-xl px-4 py-2 text-xs font-bold text-[#2563EB] flex items-center gap-1.5 self-start sm:self-auto">
          <Info size={14} /> Demo Mode
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'This Month',    value: loading ? '...' : `$${earningsData.thisMonth.toLocaleString()}`,  sub: 'Net earnings' },
          { label: 'Total Earned',  value: loading ? '...' : `$${earningsData.totalEarned.toLocaleString()}`,  sub: 'All time' },
          { label: 'Pending Payout', value: loading ? '...' : `$${earningsData.pendingPayout.toLocaleString()}`, sub: 'Next: Jul 1' },
        ].map(s => (
          <div key={s.label} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#F97316] transition-colors relative group">
            <span className="absolute top-4 right-4 text-[9px] font-bold tracking-wider text-gray-600 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">Demo</span>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-[32px] font-bold text-white mt-2">{s.value}</p>
            <p className="text-[14px] text-gray-400 mt-1 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 flex flex-col items-center justify-center h-64 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#0F172A] border border-[#1E293B] flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-[#F97316]" />
        </div>
        <p className="text-[16px] font-bold text-white">Monthly earnings chart</p>
        <p className="text-[14px] text-gray-400 mt-1 font-medium">Analytics visualization placeholder</p>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-white">Monthly Breakdown</h2>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-[#1E293B] text-gray-300 hover:bg-[#0F172A] hover:text-white rounded-lg text-[14px] font-bold transition-colors cursor-pointer"
          >
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>
        <div>
          <div className="grid grid-cols-4 px-6 py-4 bg-[#0F172A] border-b border-[#1E293B] text-[12px] font-bold text-gray-500 uppercase tracking-wider">
            <span>Month</span><span>Sessions</span><span>Gross</span><span>Net (85%)</span>
          </div>
          {earningsData.history.map(m => (
            <div key={m.month} className="grid grid-cols-4 px-6 py-4 border-b border-[#1E293B] last:border-0 text-[14px] hover:bg-[#0F172A] transition-colors items-center">
              <span className="font-bold text-white">{m.month}</span>
              <span className="text-gray-400 font-medium">{m.sessions}</span>
              <span className="text-gray-400 font-medium">${m.gross.toLocaleString()}</span>
              <span className="font-bold text-green-400">${m.net.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
