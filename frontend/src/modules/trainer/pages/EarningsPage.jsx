import { DollarSign, TrendingUp, ArrowDownToLine } from 'lucide-react'

const MONTHS = [
  { month: 'Jun 2026', sessions: 48, gross: 2880, net: 2448 },
  { month: 'May 2026', sessions: 52, gross: 3120, net: 2652 },
  { month: 'Apr 2026', sessions: 45, gross: 2700, net: 2295 },
  { month: 'Mar 2026', sessions: 50, gross: 3000, net: 2550 },
]

export default function EarningsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-black">Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'This Month',    value: '$2,448',  sub: 'Net earnings' },
          { label: 'Total Earned',  value: '$9,945',  sub: 'All time' },
          { label: 'Pending Payout', value: '$1,224', sub: 'Next: Jul 1' },
        ].map(s => (
          <div key={s.label} className="border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-black text-black mt-2">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="border border-gray-200 p-6 flex flex-col items-center justify-center h-40 bg-gray-50">
        <TrendingUp size={28} className="text-gray-300 mb-2" />
        <p className="text-sm text-gray-400">Monthly earnings chart</p>
      </div>

      {/* Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Monthly Breakdown</h2>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-black hover:underline">
            <ArrowDownToLine size={12} /> Export CSV
          </button>
        </div>
        <div className="border border-gray-200">
          <div className="grid grid-cols-4 px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Month</span><span>Sessions</span><span>Gross</span><span>Net (85%)</span>
          </div>
          {MONTHS.map(m => (
            <div key={m.month} className="grid grid-cols-4 px-4 py-3 border-b border-gray-50 last:border-0 text-sm">
              <span className="font-medium text-black">{m.month}</span>
              <span className="text-gray-600">{m.sessions}</span>
              <span className="text-gray-600">${m.gross.toLocaleString()}</span>
              <span className="font-semibold text-black">${m.net.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
