import { useState, useEffect } from 'react'
import { Check, ShieldCheck, Lock, CreditCard, Star, ChevronRight, ChevronLeft, UserCheck, Loader2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Toast from '../../../shared/components/Toast'
import API from '../../../shared/utils/api'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { updateSubscription, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // ── Step: 1 = Select Trainer, 2 = Payment ─────────────────────────────────
  const [step, setStep] = useState(1)

  // ── Trainer selection state ────────────────────────────────────────────────
  const [trainers, setTrainers] = useState([])
  const [trainersLoading, setTrainersLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState(null)

  // Determine selected plan from navigation state or default to wellness
  const selectedPlan = location.state?.plan || 'wellness'

  // Configure plan particulars dynamically
  const planDetails = {
    free: {
      name: 'Free Plan',
      price: 0,
      subtext: 'Free tier features. No billing.',
      features: ['BMI / BMR calculators', 'AI diet plan (3 per month)', 'Browse trainer profiles'],
      tax: 0,
      subtotal: 0
    },
    wellness: {
      name: 'Wellness Plan (Monthly)',
      price: 999,
      subtext: 'Billed every month. Cancel anytime.',
      features: ['Dedicated wellness coach', 'Custom Diet + Workout plan', 'Progress tracking dashboard', 'Unlimited AI food photo analysis', 'Chat support with coach'],
      tax: 152.39,
      subtotal: 846.61
    },
    personal_training: {
      name: 'Personal Training Plan (Monthly)',
      price: 2499,
      subtext: 'Billed every month. Cancel anytime.',
      features: ['Everything in Wellness', 'Live 1-on-1 video sessions', 'Real-time form correction', 'Priority coach support', 'Weekly check-in calls'],
      tax: 381.20,
      subtotal: 2117.80
    }
  }[selectedPlan] || {
    name: 'Wellness Plan (Monthly)',
    price: 999,
    subtext: 'Billed every month. Cancel anytime.',
    features: ['Dedicated wellness coach', 'Custom Diet + Workout plan', 'Progress tracking dashboard', 'Unlimited AI food photo analysis', 'Chat support with coach'],
    tax: 152.39,
    subtotal: 846.61
  }

  // ── Fetch trainers on mount ────────────────────────────────────────────────
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setTrainersLoading(true)
        const res = await fetch(`${API}/trainers`, { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load trainers')
        const data = await res.json()

        // Filter by plan type: wellness → wellness_coach, PT → trainer
        const targetRole = selectedPlan === 'wellness' ? 'wellness_coach' : 'trainer'
        const filtered = data.filter(t => t.role === targetRole || data.length <= 3)

        const mapped = filtered.map(t => ({
          id: t._id,
          name: t.userId?.name || 'Unknown',
          role: t.role === 'wellness_coach' ? 'Wellness Coach' : 'Personal Trainer',
          languages: t.languagesSpoken || [],
          rating: t.rating || 0,
          reviews: t.reviewCount || 0,
          specialties: t.specialties || [],
          image: t.userId?.avatar || null,
          initial: (t.userId?.name || 'U').charAt(0).toUpperCase()
        }))

        setTrainers(mapped)
        // Auto-select first if only 1
        if (mapped.length === 1) setSelectedTrainer(mapped[0].id)
      } catch (err) {
        console.error('Error fetching trainers:', err)
        setToastMessage('Failed to load coaches. Please try again.')
      } finally {
        setTrainersLoading(false)
      }
    }

    fetchTrainers()
  }, [selectedPlan])

  // ── Handle Payment + Assign Trainer ────────────────────────────────────────
  const handlePayment = async (e) => {
    e.preventDefault()

    if (!selectedTrainer) {
      setToastMessage('Please select a coach first!')
      setStep(1)
      return
    }

    setLoading(true)

    // Simulate payment delay
    await new Promise(r => setTimeout(r, 1500))

    try {
      // Call backend to assign trainer + update subscription
      const res = await fetch(`${API}/users/assign-trainer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          trainerId: selectedTrainer, 
          plan: selectedPlan,
          paymentToken: `tok_mock_${Math.random().toString(36).substring(2)}` // Secure mock token
        })
      })

      const data = await res.json()

      if (res.ok && data.user) {
        // Update AuthContext with the new user data (includes assignedTrainer)
        updateSubscription(selectedPlan, data.user)
        setToastMessage(`Payment of ₹${planDetails.price} successful! Coach assigned.`)

        setTimeout(() => {
          navigate('/dashboard/coach')
        }, 1000)
      } else {
        setToastMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setToastMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1: SELECT YOUR COACH
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span className="w-7 h-7 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[11px] font-black">1</span>
              Select Coach
            </div>
            <ChevronRight size={14} className="text-gray-600" />
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest">
              <span className="w-7 h-7 rounded-full bg-white/10 text-gray-500 flex items-center justify-center text-[11px] font-black border border-white/10">2</span>
              Payment
            </div>
          </div>
          <h1 className="text-3xl font-black text-white font-['Syne'] mt-4">Choose Your Coach</h1>
          <p className="text-gray-400 mt-1 text-[15px]">
            Select a {selectedPlan === 'wellness' ? 'wellness coach' : 'personal trainer'} for your <span className="text-[#F97316] font-semibold">{planDetails.name}</span>
          </p>
        </div>

        {/* Trainer Grid */}
        {trainersLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-[#F97316] animate-spin" />
            <span className="text-gray-400 ml-3 font-medium">Loading coaches…</span>
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
            <UserCheck size={40} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Coaches Available</h3>
            <p className="text-gray-400 text-sm">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {trainers.map(trainer => {
              const isSelected = selectedTrainer === trainer.id
              return (
                <button
                  key={trainer.id}
                  onClick={() => setSelectedTrainer(trainer.id)}
                  className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                    isSelected
                      ? 'border-[#F97316] bg-[#F97316]/10 shadow-[0_0_30px_rgba(249,115,22,0.15)]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                  }`}
                >
                  {/* Selection checkmark */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg" style={{ animation: 'popIn 0.2s ease' }}>
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}

                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-4 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-[0_4px_16px_rgba(249,115,22,0.4)]'
                      : 'bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/10'
                  }`}>
                    {trainer.image
                      ? <img src={trainer.image} alt={trainer.name} className="w-full h-full rounded-2xl object-cover" />
                      : trainer.initial
                    }
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-white font-bold text-[16px] mb-1">{trainer.name}</h3>
                  <p className={`text-[13px] font-semibold mb-3 ${isSelected ? 'text-[#F97316]' : 'text-gray-500'}`}>{trainer.role}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold text-sm">{trainer.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-xs">({trainer.reviews} reviews)</span>
                  </div>

                  {/* Specialties */}
                  {trainer.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.specialties.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[11px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Languages */}
                  {trainer.languages.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3">
                      Speaks: {trainer.languages.join(', ')}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!selectedTrainer) {
                setToastMessage('Please select a coach to continue!')
                return
              }
              setStep(2)
            }}
            disabled={!selectedTrainer}
            className={`px-10 py-4 rounded-xl font-bold text-[15px] flex items-center gap-2 transition-all duration-200 ${
              selectedTrainer
                ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] hover:shadow-[0_0_36px_rgba(249,115,22,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Payment
            <ChevronRight size={18} />
          </button>
        </div>

        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}

        <style>{`
          @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
        `}</style>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2: PAYMENT
  // ═══════════════════════════════════════════════════════════════════════════
  const selectedTrainerObj = trainers.find(t => t.id === selectedTrainer)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header with steps */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest">
            <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-[11px] font-black">
              <Check size={14} strokeWidth={3} />
            </span>
            Coach Selected
          </div>
          <ChevronRight size={14} className="text-gray-600" />
          <div className="flex items-center gap-2 text-xs font-bold text-[#F97316] uppercase tracking-widest">
            <span className="w-7 h-7 rounded-full bg-[#F97316] text-white flex items-center justify-center text-[11px] font-black">2</span>
            Payment
          </div>
        </div>
        <h1 className="text-3xl font-black text-white font-['Syne'] mt-4">Complete Your Order</h1>
        <p className="text-gray-500 mt-1">You're one step away from transforming your life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <div className="order-2 md:order-1 sticky top-8 space-y-6">
          {/* Selected Coach Card */}
          {selectedTrainerObj && (
            <div className="bg-[#F97316]/5 border border-[#F97316]/20 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white text-lg font-black shadow-lg">
                  {selectedTrainerObj.initial}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-[15px]">{selectedTrainerObj.name}</h3>
                  <p className="text-[#F97316] text-xs font-semibold">{selectedTrainerObj.role}</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-400 hover:text-white font-bold transition-colors cursor-pointer underline underline-offset-2"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <Card padding="lg" className="!bg-gray-800/50 border-0">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">{planDetails.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{planDetails.subtext}</p>
              </div>
              <p className="font-black text-xl text-white">₹{planDetails.price}</p>
            </div>
            <ul className="space-y-3 mb-8">
              {planDetails.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-400">
                  <Check size={16} className="shrink-0 text-[#F97316] mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3 pt-6 border-t border-gray-700 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold text-white">₹{planDetails.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Taxes (GST 18%)</span><span className="font-bold text-white">₹{planDetails.tax.toFixed(2)}</span></div>
              <div className="flex justify-between pt-4 border-t border-gray-700 mt-2">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="font-black text-white text-2xl">₹{planDetails.price.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="order-1 md:order-2 space-y-8">
          <Card padding="lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              <div className="flex gap-1 items-center bg-gray-800 px-2 py-1 rounded text-xs font-bold text-gray-400">
                <span className="w-2 h-2 bg-[#F97316] rounded-full inline-block mr-1"></span> MOCK GATEWAY
              </div>
            </div>
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="flex border border-gray-800 rounded-lg p-1 bg-gray-800/50">
                <button type="button" className="flex-1 py-2 bg-gray-900 rounded-md shadow-sm text-sm font-bold border border-gray-700 flex items-center justify-center gap-2 text-white">
                  <CreditCard size={16}/> Card
                </button>
                <button type="button" className="flex-1 py-2 rounded-md text-sm font-bold text-gray-500 hover:text-white">UPI</button>
                <button type="button" className="flex-1 py-2 rounded-md text-sm font-bold text-gray-500 hover:text-white">Netbanking</button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Card Number</label>
                  <input type="text" placeholder="1111 2222 3333 4444" required className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white font-mono bg-gray-800 text-white placeholder-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-1">Expiry Date</label>
                    <input type="text" placeholder="12/29" required className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white font-mono bg-gray-800 text-white placeholder-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-1">CVV</label>
                    <input type="text" placeholder="999" required className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white font-mono bg-gray-800 text-white placeholder-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Name on Card</label>
                  <input type="text" placeholder="John Doe" required className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white bg-gray-800 text-white placeholder-gray-600" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  className="text-lg bg-[#F97316] hover:bg-[#EA580C]"
                >
                  {loading ? 'Processing Payment…' : `Pay ₹${planDetails.price.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </Card>
          
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-1.5"><Lock size={16}/> 256-bit SSL</div>
            <div className="flex items-center gap-1.5"><ShieldCheck size={16}/> Secure Payment</div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
