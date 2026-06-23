import { Users, UserCheck, IndianRupee, Clock, ChevronRight } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import Table from '../../../shared/components/Table'

export default function AdminDashboardPage() {
  const recentRegistrations = [
    { id: 1, name: 'Sanjay Kumar', role: 'Client', date: 'Oct 15, 2026', status: 'Active' },
    { id: 2, name: 'Priya Nair', role: 'Trainer', date: 'Oct 15, 2026', status: 'Pending' },
    { id: 3, name: 'Arjun Menon', role: 'Trainer', date: 'Oct 14, 2026', status: 'Active' },
    { id: 4, name: 'Meera Thomas', role: 'Client', date: 'Oct 14, 2026', status: 'Active' },
  ]
  const columns = [
    { label: 'Name', key: 'name', render: (val) => <span className="font-bold text-white">{val}</span> },
    { label: 'Role', key: 'role', render: (val) => <Badge label={val} variant={val === 'Trainer' ? 'outline' : 'default'} /> },
    { label: 'Date', key: 'date' },
    { label: 'Status', key: 'status', render: (val) => <Badge label={val} variant={val === 'Active' ? 'active' : 'inactive'} /> },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div><h1 className="text-3xl font-black text-white">Admin Dashboard</h1><p className="text-gray-500 mt-1">Platform overview and pending actions.</p></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: '1,240', icon: Users },
          { label: 'Active Trainers', val: '89', icon: UserCheck },
          { label: 'Monthly Revenue', val: '₹1,84,000', icon: IndianRupee },
          { label: 'Pending Approvals', val: '7', icon: Clock },
        ].map((stat, i) => (
          <Card key={i} padding="md" className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shrink-0 border border-gray-700"><stat.icon className="text-white" size={24} /></div>
            <div><p className="text-sm text-gray-500 font-bold">{stat.label}</p><p className="text-2xl font-black text-white">{stat.val}</p></div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card padding="lg">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Overview</h2>
            <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700"><span className="font-bold text-gray-500">Revenue Chart Placeholder</span></div>
          </Card>
          <Card padding="none" className="overflow-hidden">
            <div className="p-6 border-b border-gray-800"><h2 className="text-xl font-bold text-white">Recent Registrations</h2></div>
            <Table columns={columns} data={recentRegistrations} />
          </Card>
        </div>

        <div className="space-y-8">
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-white">Pending Approvals</h2><Badge label="7" variant="active" /></div>
            <div className="space-y-4">
              {[
                { name: 'Priya Nair', spec: 'Yoga, Nutrition', exp: '4 years' },
                { name: 'Karthik S', spec: 'Strength, HIIT', exp: '2 years' },
                { name: 'Aiswarya M', spec: 'Pilates', exp: '5 years' },
              ].map((t, i) => (
                <div key={i} className="p-4 border border-gray-800 rounded-xl bg-gray-800/50">
                  <div className="flex justify-between items-start mb-3">
                    <div><h3 className="font-bold text-white">{t.name}</h3><p className="text-xs text-gray-500">{t.spec}</p></div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">{t.exp}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" className="flex-1 text-xs py-1.5 px-0">Approve</Button>
                    <Button variant="secondary" className="flex-1 text-xs py-1.5 px-0 text-red-500">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" fullWidth className="mt-4">View All <ChevronRight size={16} className="ml-1" /></Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
