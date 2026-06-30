import { useState } from 'react'
import { Camera, Plus, X } from 'lucide-react'

export default function TrainerProfileEditPage() {
  const [tags, setTags] = useState(['Strength', 'HIIT', 'Mobility'])
  const [newTag, setNewTag] = useState('')

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Edit Profile</h1>
        <p className="text-[14px] text-gray-400 mt-1">Manage your public trainer profile and specialties.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-sm">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-[#1E293B] text-gray-400 flex items-center justify-center text-[32px] font-bold rounded-full border border-white/10">A</div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg border border-[#0F172A]">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <p className="text-[16px] font-semibold text-white">Profile Photo</p>
            <p className="text-[14px] text-gray-400 mt-1">JPG or PNG, max 2MB</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[['First name', 'Alex'], ['Last name', 'Rivera']].map(([l, v]) => (
              <div key={l}>
                <label className="block text-[14px] font-semibold text-gray-300 mb-2">{l}</label>
                <input defaultValue={v} className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white placeholder-gray-500 transition-colors" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-2">Bio</label>
            <textarea rows={4} defaultValue="Certified personal trainer with 5 years of experience in strength and conditioning." className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white placeholder-gray-500 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Hourly Rate ($)</label>
              <input type="number" defaultValue="60" className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white transition-colors" />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Years Experience</label>
              <input type="number" defaultValue="5" className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white transition-colors" />
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-3">Specialties</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-2 px-3 py-1.5 bg-[#1E293B] border border-white/10 text-white rounded-lg text-[12px] font-semibold">
                  {t}
                  <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-gray-400 hover:text-white"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add specialty..." className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white placeholder-gray-500 transition-colors" />
              <button onClick={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.trim()]); setNewTag('') } }} className="px-4 py-3 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg text-[14px] font-semibold transition-colors flex items-center justify-center">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-[14px] font-bold transition-all shadow-sm">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
