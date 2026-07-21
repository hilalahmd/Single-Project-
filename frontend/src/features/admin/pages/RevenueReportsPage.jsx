import { useState, useEffect } from 'react'
import { Download, TrendingUp, Loader } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function RevenueReportsPage() {
  const [stats, setStats] = useState({
    grossRevenue: 0,
    platformCommission: 0,
    trainerPayouts: 0,
    netRevenue: 0
  })
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      const res = await fetch(`${API}/admin/revenue`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setReports(data.reports)
      }
    } catch (error) {
      console.error('Failed to fetch revenue data', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleExportCSV = () => {
    const headers = ['Month', 'Active Subs', 'Wellness Rev.', 'PT Rev.', 'Total Revenue', 'Commission', 'Net Profit']
    const rows = reports.map(r => [r.month, r.sub, r.wRev, r.ptRev, r.total, r.comm, r.net])
    
    const csvRows = [headers.join(','), ...rows.map(e => e.join(','))]
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "FitForge_Admin_Revenue.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-gray-500" size={32} />
      </div>
    )
  }

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
          <button onClick={handleExportCSV} className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 text-black text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} className="mr-2"/> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Gross Revenue</p>
          <p className="text-2xl font-bold text-black">{formatCurrency(stats.grossRevenue)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Platform Commission</p>
          <p className="text-2xl font-bold text-black">{formatCurrency(stats.platformCommission)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Trainer Payouts</p>
          <p className="text-2xl font-bold text-black">{formatCurrency(stats.trainerPayouts)}</p>
        </div>
        <div className="bg-black text-white rounded-2xl p-6 shadow-md border border-gray-800">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Net Revenue</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.netRevenue)}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black">Monthly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Month', 'Active Subs', 'Wellness Rev.', 'PT Rev.', 'Total Revenue', 'Commission (5%)', 'Net Profit'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-black">{row.month}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{row.sub}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{formatCurrency(row.wRev)}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{formatCurrency(row.ptRev)}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{formatCurrency(row.total)}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{formatCurrency(row.comm)}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{formatCurrency(row.net)}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-medium">
                    No revenue data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
