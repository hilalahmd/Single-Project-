import { useState } from 'react'
import { Check, ShieldCheck, Lock, CreditCard } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Toast from '../../../shared/components/Toast'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { updateSubscription } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

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

  const handlePayment = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate standard Razorpay/credit checkout lag (1.5 seconds)
    setTimeout(() => {
      updateSubscription(selectedPlan)
      setLoading(false)
      setToastMessage(`Payment of ₹${planDetails.price} successful! Plan activated.`)
      
      // Redirect to dashboard coach segment
      setTimeout(() => {
        navigate('/dashboard/coach')
      }, 1000)
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl font-black text-white font-['Syne']">Complete Your Order</h1>
        <p className="text-gray-500 mt-1">You're one step away from transforming your life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <div className="order-2 md:order-1 sticky top-8 space-y-8">
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
                  {loading ? 'Processing Dummy Payment...' : `Pay ₹${planDetails.price.toFixed(2)}`}
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
