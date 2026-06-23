import { DollarSign, TrendingUp, ArrowDownToLine } from 'lucide-react'

const MONTHS = [
  { month: 'Jun 2026', sessions: 48, gross: 2880, net: 2448 },
  { month: 'May 2026', sessions: 52, gross: 3120, net: 2652 },
  { month: 'Apr 2026', sessions: 45, gross: 2700, net: 2295 },
  { month: 'Mar 2026', sessions: 50, gross: 3000, net: 2550 },
]

export default function EarningsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[32px] font-bold text-black tracking-tight">Earnings</h1>
        <p className="text-[14px] text-gray-500 mt-1">Track your revenue and upcoming payouts.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'This Month',    value: '$2,448',  sub: 'Net earnings' },
          { label: 'Total Earned',  value: '$9,945',  sub: 'All time' },
          { label: 'Pending Payout', value: '$1,224', sub: 'Next: Jul 1' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-[32px] font-bold text-black mt-2">{s.value}</p>
            <p className="text-[14px] text-gray-500 mt-1 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center h-64 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
          <TrendingUp size={28} className="text-black" />
        </div>
        <p className="text-[16px] font-bold text-black">Monthly earnings chart</p>
        <p className="text-[14px] text-gray-500 mt-1 font-medium">Analytics visualization placeholder</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-black">Monthly Breakdown</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-black hover:bg-gray-50 rounded-lg text-[14px] font-bold transition-colors">
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>
        <div>
          <div className="grid grid-cols-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
            <span>Month</span><span>Sessions</span><span>Gross</span><span>Net (85%)</span>
          </div>
          {MONTHS.map(m => (
            <div key={m.month} className="grid grid-cols-4 px-6 py-4 border-b border-gray-100 last:border-0 text-[14px] hover:bg-gray-50 transition-colors items-center">
              <span className="font-bold text-black">{m.month}</span>
              <span className="text-gray-600 font-medium">{m.sessions}</span>
              <span className="text-gray-600 font-medium">${m.gross.toLocaleString()}</span>
              <span className="font-bold text-green-600">${m.net.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
