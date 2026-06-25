import { Download, TrendingUp } from 'lucide-react'

export default function RevenueReportsPage() {
  const reports = [
    { month: 'Oct 2026', sub: 450, wRev: '₹4,49,550', ptRev: '₹2,49,900', total: '₹6,99,450', comm: '₹1,39,890', net: '₹1,39,890' },
    { month: 'Sep 2026', sub: 420, wRev: '₹4,19,580', ptRev: '₹2,24,910', total: '₹6,44,490', comm: '₹1,28,898', net: '₹1,28,898' },
    { month: 'Aug 2026', sub: 380, wRev: '₹3,79,620', ptRev: '₹1,99,920', total: '₹5,79,540', comm: '₹1,15,908', net: '₹1,15,908' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Revenue Reports</h1>
          <p className="text-gray-500 mt-1 font-medium">Financial performance and platform metrics.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none">
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
          <button className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 text-black text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} className="mr-2"/> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Gross Revenue</p>
          <p className="text-2xl font-bold text-black">₹19,23,480</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Platform Commission</p>
          <p className="text-2xl font-bold text-black">₹3,84,696</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Trainer Payouts</p>
          <p className="text-2xl font-bold text-black">₹15,38,784</p>
        </div>
        <div className="bg-black text-white rounded-2xl p-6 shadow-md border border-gray-800">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Net Revenue</p>
          <p className="text-2xl font-bold text-white">₹3,84,696</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Revenue Over Time</h2>
        </div>
        <div className="w-full h-80 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 border-dashed">
          <div className="text-center">
            <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
            <span className="font-bold text-gray-400">Chart Placeholder</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black">Monthly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Month', 'Active Subs', 'Wellness Rev.', 'PT Rev.', 'Total Revenue', 'Commission (20%)', 'Net Profit'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-black">{row.month}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{row.sub}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{row.wRev}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{row.ptRev}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{row.total}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{row.comm}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
