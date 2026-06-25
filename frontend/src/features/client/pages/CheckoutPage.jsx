import { Check, ShieldCheck, Lock, CreditCard } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'

export default function CheckoutPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl font-black text-white">Complete Your Order</h1>
        <p className="text-gray-500 mt-1">You're one step away from transforming your life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <div className="order-2 md:order-1 sticky top-8 space-y-8">
          <Card padding="lg" className="!bg-gray-800/50 border-0">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">Wellness Plan (Monthly)</h3>
                <p className="text-sm text-gray-500 mt-1">Billed every month. Cancel anytime.</p>
              </div>
              <p className="font-black text-xl text-white">₹999</p>
            </div>
            <ul className="space-y-3 mb-8">
              {['Dedicated wellness coach', 'Custom Diet + Workout plan', 'Progress tracking dashboard', 'Unlimited AI food photo analysis', 'Chat support with coach'].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-400">
                  <Check size={16} className="shrink-0 text-white mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3 pt-6 border-t border-gray-700 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold text-white">₹846.61</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Taxes (GST 18%)</span><span className="font-bold text-white">₹152.39</span></div>
              <div className="flex justify-between pt-4 border-t border-gray-700 mt-2">
                <span className="font-bold text-white text-lg">Total</span>
                <span className="font-black text-white text-2xl">₹999.00</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="order-1 md:order-2 space-y-8">
          <Card padding="lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              <div className="flex gap-1 items-center bg-gray-800 px-2 py-1 rounded text-xs font-bold text-gray-500">
                <span className="w-4 h-4 bg-gray-700 rounded-sm inline-block mr-1"></span> RAZORPAY
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex border border-gray-800 rounded-lg p-1 bg-gray-800/50">
                <button className="flex-1 py-2 bg-gray-900 rounded-md shadow-sm text-sm font-bold border border-gray-700 flex items-center justify-center gap-2 text-white">
                  <CreditCard size={16}/> Card
                </button>
                <button className="flex-1 py-2 rounded-md text-sm font-bold text-gray-500 hover:text-white">UPI</button>
                <button className="flex-1 py-2 rounded-md text-sm font-bold text-gray-500 hover:text-white">Netbanking</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white font-mono bg-gray-800 text-white placeholder-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-1">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white font-mono bg-gray-800 text-white placeholder-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-1">CVV</label>
                    <input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white font-mono bg-gray-800 text-white placeholder-gray-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Name on Card</label>
                  <input type="text" placeholder="John Doe" className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white bg-gray-800 text-white placeholder-gray-600" />
                </div>
              </div>
              <div className="pt-4">
                <Button variant="primary" fullWidth size="lg" className="text-lg">Pay ₹999.00</Button>
              </div>
            </div>
          </Card>
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-1.5"><Lock size={16}/> 256-bit SSL</div>
            <div className="flex items-center gap-1.5"><ShieldCheck size={16}/> Secure Payment</div>
          </div>
        </div>
      </div>
    </div>
  )
}
