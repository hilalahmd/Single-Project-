import { useState } from 'react'
import { Camera, Image as ImageIcon, CheckCircle2, RotateCcw } from 'lucide-react'
import Card from '../../../shared/components/Card'

export default function FoodAIPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(false)

  const handleUpload = () => {
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); setResult(true) }, 2000)
  }

  const handleReset = () => { setAnalyzing(false); setResult(false) }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">AI Food Analysis</h1>
        <p className="text-[14px] text-gray-400 mt-1">Upload a photo of your meal for instant macro breakdown.</p>
      </div>

      {!result && !analyzing && (
        <button 
          onClick={handleUpload}
          className="w-full aspect-video sm:aspect-[2.5/1] bg-[#0F172A]/50 border-2 border-dashed border-[#1E293B] rounded-2xl flex flex-col items-center justify-center gap-5 hover:bg-[#0F172A] hover:border-[#2563EB] transition-all group"
        >
          <div className="w-20 h-20 bg-[#111827] rounded-full flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all border border-[#1E293B]">
            <Camera size={36} className="text-gray-500 group-hover:text-[#2563EB] transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-white text-[18px]">Upload a photo of your meal</p>
            <p className="text-[14px] text-gray-500 mt-1">or drag and drop here</p>
          </div>
        </button>
      )}

      {analyzing && (
        <div className="w-full aspect-video sm:aspect-[2.5/1] bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl flex flex-col items-center justify-center gap-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent w-[200%] animate-[shimmer_2s_infinite]"></div>
          <div className="w-20 h-20 bg-[#111827] rounded-full flex items-center justify-center border border-[#1E293B] relative z-10 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
            <div className="w-10 h-10 border-4 border-[#1E293B] border-t-[#2563EB] rounded-full animate-spin" />
          </div>
          <p className="font-semibold text-white text-[18px] relative z-10">Analyzing nutrition profile...</p>
        </div>
      )}

      {result && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#0F172A] rounded-2xl flex items-center justify-center overflow-hidden h-64 lg:h-auto border border-[#1E293B] relative">
            <ImageIcon size={64} className="text-[#1E293B]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 to-transparent"></div>
          </div>
          <Card className="flex flex-col justify-center border-[#2563EB]/30 shadow-[0_0_30px_rgba(37,99,235,0.05)]">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[11px] font-bold rounded-lg uppercase tracking-wider mb-4 flex items-center w-max gap-1.5"><CheckCircle2 size={14}/> Food Detected</span>
              <h2 className="text-[28px] font-bold text-white leading-tight">Rice + Fish Curry + Papadam</h2>
            </div>
            <div className="space-y-5 mb-10">
              {[['Calories', '520 kcal', 'text-[#22C55E]'], ['Protein', '28g', 'text-white'], ['Carbs', '62g', 'text-white'], ['Fat', '14g', 'text-white']].map(([k, v, colorClass]) => (
                <div key={k} className="flex justify-between items-center pb-5 border-b border-[#1E293B] last:border-0 last:pb-0">
                  <span className="text-gray-400 font-semibold text-[15px]">{k}</span>
                  <span className={`text-[20px] font-bold ${colorClass}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-3.5 border border-[#1E293B] bg-[#0F172A] text-white text-[14px] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] rounded-lg transition-colors flex items-center justify-center" onClick={handleReset}>
                <RotateCcw size={18} className="mr-2" /> Retake
              </button>
              <button className="flex-1 py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white text-[14px] font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]" onClick={handleReset}>
                Log This Meal
              </button>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-[20px] font-semibold text-white mb-6 mt-10">Recent Analyses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { n: 'Chicken Biryani', cal: 650, d: 'Today, 1:30 PM' },
            { n: 'Masala Dosa', cal: 400, d: 'Yesterday, 9:00 AM' },
            { n: 'Grilled Salmon & Veggies', cal: 450, d: 'Oct 13, 8:00 PM' },
            { n: 'Puttu & Kadala Curry', cal: 500, d: 'Oct 13, 8:30 AM' },
            { n: 'Oatmeal & Banana', cal: 350, d: 'Oct 12, 8:00 AM' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 p-5 border border-[#1E293B] rounded-xl hover:border-[#2563EB] transition-colors bg-[#111827] group">
              <div className="w-16 h-16 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0 border border-[#1E293B] group-hover:border-[#2563EB]/50 transition-colors">
                <ImageIcon size={24} className="text-gray-500 group-hover:text-[#2563EB] transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-[16px]">{item.n}</h3>
                <p className="text-[13px] text-gray-500 mt-1">{item.d}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-[18px] group-hover:text-[#22C55E] transition-colors">{item.cal}</p>
                <p className="text-[11px] uppercase font-bold text-gray-500 tracking-wider">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
