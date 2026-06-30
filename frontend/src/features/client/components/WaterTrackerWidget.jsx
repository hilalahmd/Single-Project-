import { useState, useEffect } from 'react'
import { Plus, Droplet, Edit2, CheckCircle2 } from 'lucide-react'

export default function WaterTrackerWidget() {
  const [intake, setIntake] = useState(1250)
  const [goal, setGoal] = useState(3000)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [tempGoal, setTempGoal] = useState(goal)
  const [customAmount, setCustomAmount] = useState('')

  const percentage = Math.min((intake / goal) * 100, 100)
  const goalReached = intake >= goal

  // For the water clip, viewBox is 0 0 100 240, so height is 240. 
  // 0% filled = y at 240, 100% filled = y at 0
  const fillY = 240 - (percentage / 100) * 240

  const addWater = (amount) => {
    setIntake(prev => prev + amount)
  }

  const handleAddCustom = () => {
    const amount = parseInt(customAmount)
    if (!isNaN(amount) && amount > 0) {
      addWater(amount)
      setCustomAmount('')
    }
  }

  const saveGoal = () => {
    const newGoal = parseInt(tempGoal)
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal)
    }
    setIsEditingGoal(false)
  }

  // Removed body shape path for sleek chart design

  return (
    <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Full Component Background Water Flow */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <svg viewBox="0 0 100 240" className="w-full h-full" preserveAspectRatio="none">
          <g style={{ transform: `translateY(${fillY}px)`, transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <path d="M -50 5 Q 0 -5, 50 5 T 150 5 L 150 250 L -50 250 Z" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke">
              <animate attributeName="d" 
                values="M -50 5 Q 0 -5, 50 5 T 150 5 L 150 250 L -50 250 Z; M -50 5 Q 0 15, 50 5 T 150 5 L 150 250 L -50 250 Z; M -50 5 Q 0 -5, 50 5 T 150 5 L 150 250 L -50 250 Z" 
                dur="6s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
      </div>

      {/* Stats & Controls Overlay */}
      <div className="relative z-10 flex flex-col justify-center space-y-10 w-full">
          
          {/* Header & Stats */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-black text-white font-['Syne'] uppercase tracking-tight">Water Intake</h2>
              {goalReached ? (
                <span className="inline-flex items-center gap-1.5 bg-[#ff6b1a]/20 border border-[#ff6b1a]/50 text-[#ff6b1a] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  <CheckCircle2 size={12} /> Goal Reached!
                </span>
              ) : (
                <span className="bg-[#ff6b1a]/20 border border-[#ff6b1a]/50 text-[#ff6b1a] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b1a] inline-block mr-1 animate-pulse"></span> {Math.round(percentage)}%
                </span>
              )}
            </div>
            
            <div className="flex items-end gap-3 mb-1">
              <span className="text-5xl md:text-6xl font-black text-white font-['Syne'] tracking-tighter">{intake.toLocaleString()} <span className="text-2xl text-gray-400">ml</span></span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 font-medium">
              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="number" 
                    value={tempGoal} 
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="bg-[#1a1d27] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-1 text-sm text-white w-24 focus:outline-none focus:border-[#ff6b1a]"
                    autoFocus
                  />
                  <button onClick={saveGoal} className="text-xs bg-white/10 hover:bg-[#ff6b1a] text-white px-3 py-1.5 rounded-md transition-colors font-bold">Save</button>
                  <button onClick={() => setIsEditingGoal(false)} className="text-xs text-gray-500 hover:text-white px-2 transition-colors">Cancel</button>
                </div>
              ) : (
                <>
                  <span>of {goal.toLocaleString()} ml daily goal</span>
                  <button onClick={() => setIsEditingGoal(true)} className="p-1 hover:text-[#ff6b1a] transition-colors" title="Edit Goal">
                    <Edit2 size={14} />
                  </button>
                </>
              )}
            </div>
            {!goalReached && !isEditingGoal && (
              <div className="text-sm text-gray-500 mt-2 font-medium">
                {(goal - intake).toLocaleString()} ml to go
              </div>
            )}
          </div>

          <hr className="border-[rgba(255,255,255,0.08)]" />

          {/* Controls */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quick Add</h3>
            <div className="flex flex-wrap gap-3">
              {[100, 250, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => addWater(amount)}
                  className="px-6 py-3 rounded-full border border-[#ff6b1a]/40 text-gray-300 font-bold text-sm hover:bg-gradient-to-r hover:from-[#ff6b1a] hover:to-[#ff8c3a] hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] transition-all duration-300"
                >
                  +{amount}ml
                </button>
              ))}
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pt-2">Custom Amount</h3>
            <div className="flex items-center gap-3">
              <input 
                type="number"
                placeholder="Enter ml"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                className="bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-full px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all w-36 font-medium"
              />
              <button 
                onClick={handleAddCustom}
                disabled={!customAmount}
                className="px-6 py-3.5 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wider"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <button 
              onClick={() => setIntake(0)}
              className="text-[11px] font-bold text-gray-600 uppercase tracking-wider hover:text-white transition-colors"
            >
              Reset Today
            </button>
          </div>

        </div>
      </div>
  )
}
