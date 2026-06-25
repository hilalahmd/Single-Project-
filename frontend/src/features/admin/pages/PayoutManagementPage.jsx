import { useState } from 'react'
import { IndianRupee, FileCheck, CheckCircle2 } from 'lucide-react'

export default function PayoutManagementPage() {
  const [payModal, setPayModal] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)

  const payouts = [
    { id: 1, name: 'Arjun Menon', bal: 12500, req: 12500, bank: 'HDFC •••• 1234', date: 'Oct 15, 2026', status: 'Pending' },
    { id: 2, name: 'Priya Nair', bal: 8000, req: 8000, bank: 'SBI •••• 5678', date: 'Oct 14, 2026', status: 'Pending' },
    { id: 3, name: 'Rahul S', bal: 0, req: 15000, bank: 'ICICI •••• 9012', date: 'Oct 10, 2026', status: 'Paid' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Payout Management</h1>
        <p className="text-gray-500 mt-1 font-medium">Process trainer earnings and withdrawals.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0 shadow-md">
            <IndianRupee className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Total Pending Requests</p>
            <p className="text-3xl font-bold text-black">₹20,500</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
            <FileCheck className="text-black" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Paid This Month</p>
            <p className="text-3xl font-bold text-black">₹98,000</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Trainer', 'Requested', 'Bank Details', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payouts.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-black">{row.name}</td>
                  <td className="px-6 py-4 font-bold text-black">₹{row.req.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">{row.bank}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${row.status === 'Paid' ? 'bg-white border-gray-200 text-gray-600' : 'bg-green-100 border-green-200 text-green-700'}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {row.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedPayout(row); setPayModal(true) }} className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded shadow-sm hover:bg-gray-800 transition-colors">Pay Now</button>
                        <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition-colors">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {payModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPayModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">Confirm Payout</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Amount to Pay</p>
                <p className="text-4xl font-black text-black tracking-tight">₹{selectedPayout.req.toLocaleString()}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Trainer</span>
                  <span className="font-bold text-black">{selectedPayout.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Bank Details</span>
                  <span className="font-mono font-bold text-black">{selectedPayout.bank}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setPayModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-black transition-colors">Cancel</button>
              <button onClick={() => setPayModal(false)} className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center">
                <CheckCircle2 size={16} className="mr-2"/> Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
