import { useState } from 'react'
import { Camera, Plus, X } from 'lucide-react'

export default function TrainerProfileEditPage() {
  const [tags, setTags] = useState(['Strength', 'HIIT', 'Mobility'])
  const [newTag, setNewTag] = useState('')

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-black text-black">Edit Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-3xl font-black">A</div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 flex items-center justify-center hover:border-black transition-colors">
            <Camera size={12} />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold text-black">Profile Photo</p>
          <p className="text-xs text-gray-500">JPG or PNG, max 2MB</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[['First name', 'Alex'], ['Last name', 'Rivera']].map(([l, v]) => (
            <div key={l}>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{l}</label>
              <input defaultValue={v} className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Bio</label>
          <textarea rows={4} defaultValue="Certified personal trainer with 5 years of experience in strength and conditioning." className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Hourly Rate ($)</label>
            <input type="number" defaultValue="60" className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Years Experience</label>
            <input type="number" defaultValue="5" className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors" />
          </div>
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Specialties</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1 border border-black text-xs font-medium">
                {t}
                <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-gray-400 hover:text-black"><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add specialty..." className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors" />
            <button onClick={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.trim()]); setNewTag('') } }} className="px-3 py-2 bg-black text-white hover:bg-gray-900 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button className="px-6 py-2.5 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors">
          Save Profile
        </button>
      </div>
    </div>
  )
}
