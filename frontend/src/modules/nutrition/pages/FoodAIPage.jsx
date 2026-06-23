import { useState } from 'react'
import { Camera, Image as ImageIcon, CheckCircle2, RotateCcw } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'

export default function FoodAIPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(false)

  const handleUpload = () => {
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); setResult(true) }, 2000)
  }

  const handleReset = () => { setAnalyzing(false); setResult(false) }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">AI Food Analysis</h1>
        <p className="text-gray-500 mt-1">Upload a photo of your meal for instant macros.</p>
      </div>

      {!result && !analyzing && (
        <button 
          onClick={handleUpload}
          className="w-full aspect-video sm:aspect-[2.5/1] bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-gray-800 hover:border-white transition-all group"
        >
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-700">
            <Camera size={32} className="text-white" />
          </div>
          <div className="text-center">
            <p className="font-bold text-white text-lg">Upload a photo of your meal</p>
            <p className="text-gray-500">or drag and drop</p>
          </div>
        </button>
      )}

      {analyzing && (
        <div className="w-full aspect-video sm:aspect-[2.5/1] bg-gray-900 border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin" />
          </div>
          <p className="font-bold text-white text-lg">Analyzing food...</p>
        </div>
      )}

      {result && (
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden h-64 sm:h-auto border border-gray-700">
            <ImageIcon size={48} className="text-gray-600" />
          </div>
          <Card padding="lg" className="flex flex-col justify-center">
            <div className="mb-6">
              <Badge label="Food Detected" variant="active" className="mb-2" />
              <h2 className="text-2xl font-black text-white">Rice + Fish Curry + Papadam</h2>
            </div>
            <div className="space-y-4 mb-8">
              {[['Calories', '520 kcal'], ['Protein', '28g'], ['Carbs', '62g'], ['Fat', '14g']].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center pb-4 border-b border-gray-800">
                  <span className="text-gray-500 font-bold">{k}</span>
                  <span className="text-xl font-black text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={handleReset}><RotateCcw size={16} className="mr-2" /> Retake</Button>
              <Button variant="primary" className="flex-1" onClick={handleReset}>Log This Meal</Button>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4 mt-8">Recent Analyses</h2>
        <div className="space-y-4">
          {[
            { n: 'Chicken Biryani', cal: 650, d: 'Today, 1:30 PM' },
            { n: 'Masala Dosa', cal: 400, d: 'Yesterday, 9:00 AM' },
            { n: 'Grilled Salmon & Veggies', cal: 450, d: 'Oct 13, 8:00 PM' },
            { n: 'Puttu & Kadala Curry', cal: 500, d: 'Oct 13, 8:30 AM' },
            { n: 'Oatmeal & Banana', cal: 350, d: 'Oct 12, 8:00 AM' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors bg-gray-900">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center shrink-0 border border-gray-700">
                <ImageIcon size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{item.n}</h3>
                <p className="text-xs text-gray-500">{item.d}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{item.cal}</p>
                <p className="text-[10px] uppercase font-bold text-gray-500">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
