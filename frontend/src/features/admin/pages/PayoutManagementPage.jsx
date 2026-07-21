import { useState, useEffect } from 'react'
import { IndianRupee, FileCheck, CheckCircle2 } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function PayoutManagementPage() {
  const [payModal, setPayModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const fetchPayouts = async () => {
    try {
      const res = await fetch(`${API}/payouts/all`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setPayouts(data.payouts)
        }
      }
    } catch (err) {
      console.error("Failed to load payouts", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayouts()
  }, [])

  const handleProcessPayout = async (status) => {
    if (!selectedPayout) return;
    setProcessing(true)
    try {
      const res = await fetch(`${API}/payouts/${selectedPayout._id}/process`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })
      
      const data = await res.json()
      if (data.success) {
        alert(`Payout successfully marked as ${status}`)
        setPayModal(false)
        setRejectModal(false)
        fetchPayouts() // Refresh table
      } else {
        alert(data.message || "Failed to process payout")
      }
    } catch (err) {
      alert("Server error processing payout")
    } finally {
      setProcessing(false)
    }
  }

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
            <p className="text-3xl font-bold text-black">{loading ? '...' : `₹${payouts.reduce((sum, p) => p.status === 'pending' ? sum + p.amount : sum, 0).toLocaleString()}`}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
            <FileCheck className="text-black" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Total Processed</p>
            <p className="text-3xl font-bold text-black">{loading ? '...' : `₹${payouts.reduce((sum, p) => p.status === 'processed' ? sum + p.amount : sum, 0).toLocaleString()}`}</p>
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
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">No payout requests found</td>
                </tr>
              ) : (
                payouts.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">
                      {row.trainer?.userId?.name || 'Unknown Trainer'}
                      <div className="text-xs font-normal text-gray-500">{row.trainer?.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-black">₹{row.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                      <div>A/c: {row.bankDetails?.accountNumber}</div>
                      <div>IFSC: {row.bankDetails?.ifscCode}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider
                        ${row.status === 'processed' ? 'bg-green-100 border-green-200 text-green-700' : 
                          row.status === 'rejected' ? 'bg-red-100 border-red-200 text-red-700' : 
                          'bg-yellow-100 border-yellow-200 text-yellow-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {row.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedPayout(row); setPayModal(true) }} className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded shadow-sm hover:bg-gray-800 transition-colors">Pay Now</button>
                          <button onClick={() => { setSelectedPayout(row); setRejectModal(true) }} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition-colors">Reject</button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-gray-400">Action Complete</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {payModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !processing && setPayModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">Confirm Payout</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-4">
                <p className="text-sm text-yellow-800 font-medium">
                  <strong>Important:</strong> Only mark this as Paid AFTER you have manually transferred the money from your bank account to the trainer's bank account.
                </p>
              </div>
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Amount to Transfer</p>
                <p className="text-4xl font-black text-black tracking-tight">₹{selectedPayout.amount.toLocaleString()}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Trainer Name</span>
                  <span className="font-bold text-black">{selectedPayout.trainer?.userId?.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Bank Details</span>
                  <div className="text-right">
                    <div className="font-mono font-bold text-black">{selectedPayout.bankDetails?.accountNumber}</div>
                    <div className="font-mono text-gray-500">{selectedPayout.bankDetails?.ifscCode}</div>
                    <div className="text-gray-500">{selectedPayout.bankDetails?.bankName} ({selectedPayout.bankDetails?.accountName})</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button disabled={processing} onClick={() => setPayModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-black transition-colors disabled:opacity-50">Cancel</button>
              <button disabled={processing} onClick={() => handleProcessPayout('processed')} className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center disabled:opacity-50">
                <CheckCircle2 size={16} className="mr-2"/> {processing ? 'Processing...' : 'Mark as Transferred'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !processing && setRejectModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-red-600">Reject Payout</h2>
            </div>
            <div className="p-6 space-y-4">
               <p className="text-sm text-gray-600">Are you sure you want to reject this payout request for ₹{selectedPayout.amount}? The amount will be refunded to the trainer's platform balance.</p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button disabled={processing} onClick={() => setRejectModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-black transition-colors disabled:opacity-50">Cancel</button>
              <button disabled={processing} onClick={() => handleProcessPayout('rejected')} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center disabled:opacity-50">
                {processing ? 'Processing...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
