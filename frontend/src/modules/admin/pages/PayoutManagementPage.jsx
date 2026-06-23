import { useState } from 'react'
import { IndianRupee, FileCheck, CheckCircle2, XCircle } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import Table from '../../../shared/components/Table'
import Modal from '../../../shared/components/Modal'

export default function PayoutManagementPage() {
  const [payModal, setPayModal] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)

  const payouts = [
    { id: 1, name: 'Arjun Menon', bal: 12500, req: 12500, bank: 'HDFC •••• 1234', date: 'Oct 15, 2026', status: 'Pending' },
    { id: 2, name: 'Priya Nair', bal: 8000, req: 8000, bank: 'SBI •••• 5678', date: 'Oct 14, 2026', status: 'Pending' },
    { id: 3, name: 'Rahul S', bal: 0, req: 15000, bank: 'ICICI •••• 9012', date: 'Oct 10, 2026', status: 'Paid' },
  ]

  const columns = [
    { label: 'Trainer', key: 'name', render: (val) => <span className="font-bold text-black">{val}</span> },
    { label: 'Requested', key: 'req', render: (val) => <span className="font-bold">₹{val.toLocaleString()}</span> },
    { label: 'Bank Details', key: 'bank', render: (val) => <span className="text-gray-500 font-mono text-xs">{val}</span> },
    { label: 'Date', key: 'date' },
    { label: 'Status', key: 'status', render: (val) => <Badge label={val} variant={val === 'Paid' ? 'outline' : 'active'} /> },
    { label: 'Actions', key: 'actions', render: (_, row) => row.status === 'Pending' ? (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => { setSelectedPayout(row); setPayModal(true) }}>Pay Now</Button>
          <Button variant="ghost" size="sm" className="text-red-600 border border-gray-200 hover:bg-red-50">Reject</Button>
        </div>
      ) : <span className="text-xs font-bold text-gray-400">Settled</span>
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black">Payout Management</h1>
        <p className="text-gray-500 mt-1">Process trainer earnings and withdrawals.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card padding="md" className="flex items-center gap-4 border-black">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0">
            <IndianRupee className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Total Pending Requests</p>
            <p className="text-3xl font-black text-black">₹20,500</p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <FileCheck className="text-black" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Paid This Month</p>
            <p className="text-3xl font-black text-black">₹98,000</p>
          </div>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden border-gray-200">
        <Table columns={columns} data={payouts} />
      </Card>

      <Modal isOpen={payModal} onClose={() => setPayModal(false)} title="Confirm Payout">
        {selectedPayout && (
          <div className="space-y-6">
            <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-500 mb-2">Amount to Pay</p>
              <p className="text-4xl font-black text-black">₹{selectedPayout.req.toLocaleString()}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500">Trainer</span>
                <span className="font-bold text-black">{selectedPayout.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500">Bank Details</span>
                <span className="font-mono text-black">{selectedPayout.bank}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="ghost" onClick={() => setPayModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setPayModal(false)}><CheckCircle2 size={16} className="mr-2"/> Mark as Paid</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
