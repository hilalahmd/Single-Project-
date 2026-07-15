import { useState, useEffect, useRef } from 'react'
import { Camera, Plus, X } from 'lucide-react'
import API from '../../../shared/utils/api'
import { useAuth } from '../../../shared/context/AuthContext'

export default function TrainerProfileEditPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [bio, setBio] = useState('')
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [wellnessPrice, setWellnessPrice] = useState('')
  const [personalPrice, setPersonalPrice] = useState('')
  const [languages, setLanguages] = useState([])
  
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API}/trainers/me/profile`, {
          credentials: 'include'
        })
        if (!res.ok) {
          if (res.status === 404) return // It's a new trainer without a profile yet
          throw new Error('Failed to load profile')
        }
        const data = await res.json()

        setBio(data.bio || '')
        setTags(data.specialties || [])
        setLanguages(data.languagesSpoken || [])
        setWellnessPrice(data.pricing?.wellnessMonthly || '')
        setPersonalPrice(data.pricing?.personalTrainingMonthly || '')
        setProfilePhotoUrl(data.profilePhoto || '')
      } catch (err) {
        setMessage(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const saveProfile = async () => {
    try {
      setSaving(true)
      
      const formData = new FormData()
      formData.append('bio', bio)
      formData.append('wellnessPrice', wellnessPrice)
      formData.append('personalPrice', personalPrice)
      formData.append('specialties', tags.join(','))
      formData.append('languagesSpoken', languages.join(','))
      
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile)
      }

      const res = await fetch(`${API}/trainers/profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      })
      if (!res.ok) throw new Error('Failed to save profile')
      setMessage('Profile saved successfully')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-400">
        Loading profile...
      </div>
    )
  }

  const displayImage = previewUrl || profilePhotoUrl || user?.avatar || null

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Edit Profile</h1>
        <p className="text-[14px] text-gray-400 mt-1">Manage your public trainer profile and specialties.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-[#1E293B] text-gray-400 flex items-center justify-center text-[32px] font-bold rounded-full border border-white/10 uppercase overflow-hidden">
              {displayImage ? (
                <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg border border-[#0F172A]"
            >
              <Camera size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
            />
          </div>
          <div>
            <p className="text-[20px] font-bold text-white">{user?.name || 'Trainer Name'}</p>
            <p className="text-[14px] text-gray-400 mt-1">{user?.email || 'trainer@example.com'}</p>
            <p className="text-[12px] text-gray-500 mt-2">JPG or PNG, max 2MB (Click camera to update photo)</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-2">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white placeholder-gray-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Wellness Plan Price ($/mo)</label>
              <input
                type="number"
                value={wellnessPrice}
                onChange={e => setWellnessPrice(e.target.value)}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Personal Training Price ($/mo)</label>
              <input
                type="number"
                value={personalPrice}
                onChange={e => setPersonalPrice(e.target.value)}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white transition-colors"
              />
            </div>
          </div>

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
              <input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Add specialty..."
                className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white placeholder-gray-500 transition-colors"
              />
              <button
                onClick={() => { if (newTag.trim()) { setTags(prev => [...prev, newTag.trim()]); setNewTag('') } }}
                className="px-4 py-3 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg text-[14px] font-semibold transition-colors flex items-center justify-center"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-3">Languages Spoken</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {languages.map(l => (
                <span key={l} className="flex items-center gap-2 px-3 py-1.5 bg-[#1E293B] border border-white/10 text-white rounded-lg text-[12px] font-semibold">
                  {l}
                  <button onClick={() => setLanguages(prev => prev.filter(x => x !== l))} className="text-gray-400 hover:text-white"><X size={12} /></button>
                </span>
              ))}
            </div>
            <select
              onChange={e => {
                if (e.target.value && !languages.includes(e.target.value)) {
                  setLanguages(prev => [...prev, e.target.value])
                }
                e.target.value = ''
              }}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white/5 text-white appearance-none"
            >
              <option value="">Add a language...</option>
              {['English', 'Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Telugu'].map(l => (
                <option key={l} value={l} className="bg-[#1E293B]">{l}</option>
              ))}
            </select>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            {message && <p className="text-sm text-gray-400">{message}</p>}
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-[14px] font-bold transition-all shadow-sm disabled:opacity-50 ml-auto"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}