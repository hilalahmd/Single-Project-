import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, ArrowDownToLine, Info, Lock, Wallet, X } from 'lucide-react'
import API from '../../../shared/utils/api'


export default function EarningsPage() {
  const [earningsData, setEarningsData] = useState({
    thisMonth: 0,
    totalEarned: 0,
    pendingPayout: 0,
    history: []
  })
  const [transactions, setTransactions] = useState([])
  const [subscription, setSubscription] = useState({
    isActive: true,
    status: 'pending',
    expiresAt: null
  })
  const [loading, setLoading] = useState(true)

  // Withdraw Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  })
  const [withdrawError, setWithdrawError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      // Fetch earnings stats
      const res = await fetch(`${API}/trainers/earnings`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setEarningsData(data.earningsData)
          if (data.subscription) {
            setSubscription(data.subscription)
          }
        }
      }

      // Fetch transaction history
      const txRes = await fetch(`${API}/payment/trainer-transactions`, { credentials: 'include' })
      if (txRes.ok) {
        const txData = await txRes.json()
        setTransactions(txData)
      }
    } catch (err) {
      console.error("Failed to load earnings", err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Month', 'Sessions', 'Gross Earnings ($)', 'Net Earnings ($)']
    const rows = earningsData.history.map(m => [m.month, m.sessions, m.gross, m.net])
    
    const csvRows = [headers.join(','), ...rows.map(e => e.join(','))]
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "FitForge_Earnings_Breakdown.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePaySubscription = async () => {
    try {
      // 1. Create Razorpay order on backend
      const orderRes = await fetch(`${API}/payment/trainer-subscription/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create order')
      }

      // 2. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you online?')
      }

      // 3. Get Razorpay Key from backend
      const keyRes = await fetch(`${API}/payment/key`, { credentials: 'include' })
      const { key } = await keyRes.json()

      // 4. Initialize Razorpay Checkout
      const options = {
        key: key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FitForge',
        description: 'Trainer Platform Subscription',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 5. Verify payment on backend
            const verifyRes = await fetch(`${API}/payment/trainer-subscription/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            })
            
            const verifyData = await verifyRes.json()
            if (verifyRes.ok) {
              alert(`Payment successful! Your platform subscription is activated.`)
              window.location.reload()
            } else {
              alert(verifyData.message || 'Payment verification failed.')
            }
          } catch (err) {
            alert('Error verifying payment.')
          }
        },
        theme: {
          color: '#F97316' // FitForge Orange for Trainers
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`)
      })
      paymentObject.open()

    } catch (error) {
      console.error('Payment error:', error)
      alert(error.message || 'Network error. Please try again.')
    }
  }

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault()
    setWithdrawError('')
    const amount = Number(withdrawAmount)

    if (amount < 1000) {
      return setWithdrawError("Minimum withdrawal amount is ₹1,000")
    }
    if (amount > earningsData.thisMonth) {
      return setWithdrawError("Insufficient balance")
    }
    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
      return setWithdrawError("Please fill all bank details")
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${API}/payouts/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, bankDetails })
      })
      const data = await res.json()
      if (data.success) {
        alert("Withdrawal request submitted successfully!")
        setIsWithdrawModalOpen(false)
        fetchEarnings() // Refresh balance
      } else {
        setWithdrawError(data.message || "Failed to submit request")
      }
    } catch (err) {
      setWithdrawError("Server error. Try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!loading && (!subscription.isActive || subscription.status !== 'approved')) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-4">
          <Lock size={40} className="text-[#F97316]" />
        </div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Account Locked</h1>
        <p className="text-[16px] text-gray-400 max-w-md">
          {subscription.status !== 'approved' 
            ? "Your account is currently under review. You cannot access earnings until an admin approves your profile."
            : "Your 1-month free trial or previous subscription has expired. Please pay the platform fee of Rs 399 to continue accepting clients and withdrawing earnings."}
        </p>
        
        {subscription.status === 'approved' && (
          <button 
            onClick={handlePaySubscription}
            className="mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#F97316]/20"
          >
            Pay Rs 399 Now
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Earnings</h1>
          <p className="text-[14px] text-gray-400 mt-1">Track your revenue and upcoming payouts.</p>
        </div>
        <div className="flex items-center gap-4 self-start sm:self-auto">
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg hover:shadow-[#F97316]/20"
          >
            <Wallet size={16} /> Withdraw
          </button>
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl px-4 py-2 text-xs font-bold text-[#22C55E] flex items-center gap-1.5">
            <Info size={14} /> Live Mode
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Current Balance',    value: loading ? '...' : `₹${earningsData.thisMonth.toLocaleString()}`,  sub: 'Available to withdraw' },
          { label: 'Total Earned',  value: loading ? '...' : `₹${earningsData.totalEarned.toLocaleString()}`,  sub: 'Life-time' },
          { label: 'Pending Payout', value: loading ? '...' : `₹${earningsData.pendingPayout.toLocaleString()}`, sub: 'Next: Payout Request' },
        ].map(s => (
          <div key={s.label} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#F97316] transition-colors relative group">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-[32px] font-bold text-white mt-2">{s.value}</p>
            <p className="text-[14px] text-gray-400 mt-1 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* WITHDRAW MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wallet className="text-[#F97316]" size={20} /> Request Payout
              </h2>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] mb-6">
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="text-2xl font-bold text-white">₹{earningsData.thisMonth.toLocaleString()}</p>
              </div>

              {withdrawError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm font-medium">
                  {withdrawError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Withdrawal Amount (₹)</label>
                <input 
                  type="number" 
                  min="1000"
                  max={earningsData.thisMonth}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Min ₹1000"
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                    placeholder="SBI, HDFC..."
                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">IFSC Code</label>
                  <input 
                    type="text" 
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                    placeholder="SBIN0001234"
                    className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Account Number</label>
                <input 
                  type="text" 
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  placeholder="Enter Account Number"
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Account Holder Name</label>
                <input 
                  type="text" 
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                  placeholder="Name as per bank"
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] disabled:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-4"
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic CSS Bar Chart */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm">
        <h2 className="text-[20px] font-bold text-white mb-6">Earnings Overview</h2>
        
        {earningsData.history && earningsData.history.length > 0 ? (
          <div className="flex items-end gap-4 h-56 pt-4 border-b border-[#1E293B]/50 pb-2 overflow-x-auto">
            {earningsData.history.slice().reverse().map((data) => {
              // Find max gross to scale bars
              const maxGross = Math.max(...earningsData.history.map(d => d.gross), 1000);
              const grossHeight = (data.gross / maxGross) * 100;
              const netHeight = (data.net / maxGross) * 100;
              
              return (
                <div key={data.month} className="flex flex-col items-center gap-2 flex-shrink-0 w-16 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-[#1E293B] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                    Gross: ₹{data.gross.toLocaleString()}<br/>
                    Net: ₹{data.net.toLocaleString()}
                  </div>
                  
                  {/* Bars Container */}
                  <div className="h-40 w-full flex items-end justify-center relative">
                    {/* Gross Bar (Background/Dim) */}
                    <div 
                      className="absolute bottom-0 w-8 bg-[#1E293B] rounded-t-sm transition-all duration-700"
                      style={{ height: `${grossHeight}%` }}
                    ></div>
                    {/* Net Bar (Foreground/Bright) */}
                    <div 
                      className="absolute bottom-0 w-8 bg-[#F97316] rounded-t-sm transition-all duration-1000"
                      style={{ height: `${netHeight}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{data.month.split(' ')[0]}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-56">
            <div className="w-16 h-16 rounded-full bg-[#0F172A] border border-[#1E293B] flex items-center justify-center mb-4">
              <TrendingUp size={28} className="text-[#F97316]" />
            </div>
            <p className="text-[16px] font-bold text-white">Monthly earnings chart</p>
            <p className="text-[14px] text-gray-400 mt-1 font-medium">History will populate as you get clients</p>
          </div>
        )}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#1E293B]"></div>
            <span className="text-xs text-gray-400 font-medium">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#F97316]"></div>
            <span className="text-xs text-gray-400 font-medium">Net Earnings</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-white">Monthly Breakdown</h2>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-[#1E293B] text-gray-300 hover:bg-[#0F172A] hover:text-white rounded-lg text-[14px] font-bold transition-colors cursor-pointer"
          >
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>
        <div>
          <div className="grid grid-cols-4 px-6 py-4 bg-[#0F172A] border-b border-[#1E293B] text-[12px] font-bold text-gray-500 uppercase tracking-wider">
            <span>Month</span><span>Sessions</span><span>Gross</span><span>Net (90%)</span>
          </div>
          {earningsData.history.length === 0 ? (
             <div className="px-6 py-8 text-center text-gray-500">No earnings history yet.</div>
          ) : (
             earningsData.history.map(m => (
               <div key={m.month} className="grid grid-cols-4 px-6 py-4 border-b border-[#1E293B] last:border-0 text-[14px] hover:bg-[#0F172A] transition-colors items-center">
                 <span className="font-bold text-white">{m.month}</span>
                 <span className="text-gray-400 font-medium">{m.sessions}</span>
                 <span className="text-gray-400 font-medium">₹{m.gross.toLocaleString()}</span>
                 <span className="font-bold text-green-400">₹{m.net.toLocaleString()}</span>
               </div>
             ))
          )}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-white">Recent Client Payments</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-[#1E293B]/50 px-3 py-1.5 rounded-full">
            <Info size={14} className="text-blue-400" />
            A 10% platform fee is deducted from all client payments
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-5 px-6 py-4 bg-[#0F172A] border-b border-[#1E293B] text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              <span>Client</span>
              <span>Plan</span>
              <span>Gross (Paid)</span>
              <span>Fee (10%)</span>
              <span>Net Earning</span>
            </div>
            {transactions.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No client payments yet.</div>
            ) : (
              transactions.map(tx => (
                <div key={tx._id} className="grid grid-cols-5 px-6 py-4 border-b border-[#1E293B] last:border-0 text-[14px] hover:bg-[#0F172A] transition-colors items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1E293B] overflow-hidden">
                      {tx.user?.avatar ? (
                        <img src={tx.user.avatar} alt={tx.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs bg-blue-600">
                          {tx.user?.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{tx.user?.name || 'Unknown User'}</p>
                      <p className="text-[12px] text-gray-500">{new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <span className="text-gray-300 font-medium capitalize">{tx.planTier.replace('_', ' ')}</span>
                  <span className="text-gray-300 font-medium">₹{(tx.amount).toLocaleString()}</span>
                  <span className="text-red-400 font-medium">-₹{(tx.amount * 0.1).toLocaleString()}</span>
                  <span className="font-bold text-green-400">₹{(tx.amount * 0.9).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
