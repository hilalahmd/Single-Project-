import { Calendar as CalendarIcon, Download, TrendingUp } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Table from '../../../shared/components/Table'

export default function RevenueReportsPage() {
  const reports = [
    { month: 'Oct 2026', sub: 450, wRev: '₹4,49,550', ptRev: '₹2,49,900', total: '₹6,99,450', comm: '₹1,39,890', net: '₹1,39,890' },
    { month: 'Sep 2026', sub: 420, wRev: '₹4,19,580', ptRev: '₹2,24,910', total: '₹6,44,490', comm: '₹1,28,898', net: '₹1,28,898' },
    { month: 'Aug 2026', sub: 380, wRev: '₹3,79,620', ptRev: '₹1,99,920', total: '₹5,79,540', comm: '₹1,15,908', net: '₹1,15,908' },
  ]

  const columns = [
    { label: 'Month', key: 'month', render: (val) => <span className="font-bold text-black">{val}</span> },
    { label: 'Active Subs', key: 'sub' },
    { label: 'Wellness Rev.', key: 'wRev' },
    { label: 'PT Rev.', key: 'ptRev' },
    { label: 'Total Revenue', key: 'total', render: (val) => <span className="font-bold text-gray-700">{val}</span> },
    { label: 'Commission (20%)', key: 'comm' },
    { label: 'Net Profit', key: 'net', render: (val) => <span className="font-black text-black">{val}</span> },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Revenue Reports</h1>
          <p className="text-gray-500 mt-1">Financial performance and platform metrics.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black appearance-none">
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
          <Button variant="secondary"><Download size={16} className="mr-2"/> Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="md">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Gross Revenue</p>
          <p className="text-2xl font-black text-black">₹19,23,480</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Platform Commission</p>
          <p className="text-2xl font-black text-black">₹3,84,696</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Trainer Payouts</p>
          <p className="text-2xl font-black text-black">₹15,38,784</p>
        </Card>
        <Card padding="md" className="bg-black text-white">
          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Net Revenue</p>
          <p className="text-2xl font-black text-white">₹3,84,696</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Revenue Over Time</h2>
        </div>
        <div className="w-full h-80 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <TrendingUp size={48} className="text-gray-300 mx-auto mb-4" />
            <span className="font-bold text-gray-400">Chart Placeholder</span>
          </div>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black">Monthly Breakdown</h2>
        </div>
        <Table columns={columns} data={reports} />
      </Card>
    </div>
  )
}
