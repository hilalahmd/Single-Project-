import { useNavigate } from 'react-router-dom'
import { Star, Globe } from 'lucide-react'

const TRAINERS = [
  { name: 'Arjun Menon',  spec: 'Weight Loss',     lang: 'Malayalam · English', rating: 4.9, clients: 120, price: '₹999',   gradient: 'from-[#2563EB] to-[#06B6D4]' },
  { name: 'Priya Nair',   spec: 'Yoga & Nutrition', lang: 'Malayalam · Tamil',   rating: 4.8, clients: 98,  price: '₹1,499', gradient: 'from-[#7C3AED] to-[#EC4899]' },
  { name: 'Rahul Sharma', spec: 'Muscle Building',  lang: 'Hindi · English',     rating: 4.9, clients: 145, price: '₹999',   gradient: 'from-[#F59E0B] to-[#EF4444]' },
  { name: 'Divya Thomas', spec: 'HIIT & Cardio',    lang: 'Malayalam · English', rating: 5.0, clients: 87,  price: '₹2,499', gradient: 'from-[#10B981] to-[#2563EB]' },
]

export default function TrainersSection() {
  const navigate = useNavigate()

  return (
    <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold px-4 py-2 rounded-full tracking-[0.15em] uppercase mb-4">
              <Star size={13} className="fill-[#F59E0B]" /> Certified Trainers
            </div>
            <h2 className="text-[clamp(2rem,4.5vw,4rem)] font-black text-white font-['Syne'] tracking-tight leading-none">
              Meet Our Trainers
            </h2>
            <p className="text-gray-400 text-base mt-2">Expert coaches ready to guide your journey.</p>
          </div>
          <button
            onClick={() => navigate('/trainers')}
            className="hidden md:block text-sm font-bold text-[#2563EB] hover:text-white transition-colors"
          >
            View all trainers →
          </button>
        </div>

        {/* Trainer Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRAINERS.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/trainers')}
            >
              <div className="text-center">
                {/* Avatar */}
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.gradient} mx-auto mb-4 flex items-center justify-center text-xl font-black text-white shadow-lg`}
                >
                  {t.name.charAt(0)}
                </div>

                <h3 className="text-base font-bold text-white">{t.name}</h3>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1.5 text-xs mt-1.5 mb-3 text-[#A0AABF]">
                  <Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="font-bold text-white">{t.rating}</span>
                  <span className="text-gray-600">· {t.clients} clients</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  <span className="px-2.5 py-0.5 bg-[#2563EB]/20 text-[#2563EB] text-xs font-bold rounded-full">
                    {t.spec}
                  </span>
                  <span className="px-2.5 py-0.5 bg-white/10 text-gray-300 text-xs font-bold rounded-full flex items-center gap-1">
                    <Globe size={9} /> {t.lang}
                  </span>
                </div>

                {/* Price */}
                <div className="text-xl font-black text-white mb-4">
                  {t.price}
                  <span className="text-xs text-gray-400 font-normal ml-1">/mo</span>
                </div>

                <button className="w-full py-2.5 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-[#2563EB] transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
