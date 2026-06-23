import { useState } from 'react'
import { Search, Eye, XCircle } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import Table from '../../../shared/components/Table'

export default function SubscriptionManagementPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const subscriptions = [
    { id: 1, client: 'Hilal', trainer: 'Arjun Menon', plan: 'Wellness', start: 'Oct 1, 2026', end: 'Nov 1, 2026', amt: '₹999', status: 'Active' },
    { id: 2, client: 'Meera Thomas', trainer: 'Priya Nair', plan: 'Personal Training', start: 'Sep 15, 2026', end: 'Oct 15, 2026', amt: '₹2,499', status: 'Expired' },
    { id: 3, client: 'Sanjay Kumar', trainer: 'Arjun Menon', plan: 'Wellness', start: 'Oct 10, 2026', end: 'Nov 10, 2026', amt: '₹999', status: 'Active' },
    { id: 4, client: 'Rahul S', trainer: 'Karthik S', plan: 'Personal Training', start: 'Aug 1, 2026', end: 'Sep 1, 2026', amt: '₹2,499', status: 'Cancelled' },
  ]

  const columns = [
    { label: 'Client', key: 'client', render: (val) => <span className="font-bold text-black">{val}</span> },
    { label: 'Trainer', key: 'trainer' },
    { label: 'Plan', key: 'plan', render: (val) => <span className="font-medium">{val}</span> },
    { label: 'Start Date', key: 'start' },
    { label: 'End Date', key: 'end' },
    { label: 'Amount', key: 'amt' },
    { label: 'Status', key: 'status', render: (val) => <Badge label={val} variant={val === 'Active' ? 'active' : val === 'Cancelled' ? 'danger' : 'outline'} /> },
    { label: 'Actions', key: 'actions', render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="p-1.5"><Eye size={16}/></Button>
          {row.status === 'Active' && <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"><XCircle size={16}/></Button>}
        </div>
      ) 
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black">Subscription Management</h1>
        <p className="text-gray-500 mt-1">Monitor and manage user subscriptions.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card padding="md">
          <p className="text-sm text-gray-500 font-bold mb-1">Total Active</p>
          <p className="text-2xl font-black text-black">845</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-500 font-bold mb-1">Expired This Month</p>
          <p className="text-2xl font-black text-black">124</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-500 font-bold mb-1">Cancelled</p>
          <p className="text-2xl font-black text-black">32</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Active', 'Expired', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${activeFilter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search client or trainer..." className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-gray-200">
        <Table columns={columns} data={subscriptions.filter(s => activeFilter === 'All' || s.status === activeFilter)} />
      </Card>
    </div>
  )
}
