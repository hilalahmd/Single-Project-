import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import API from '../../../shared/utils/api'
import { apiClient as api } from '../../../shared/utils/api'
import { useAuth } from '../../../shared/context/AuthContext'

export default function ClientProfilePage() {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    preferredLanguage: 'English',
    languagesSpoken: 'English',
    avatar: '',
    bio: ''
  })

  const [metrics, setMetrics] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'Male',
    activityLevel: 'Sedentary',
    goal: 'Weight Loss'
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API}/users/profile`, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()

        setProfile({
          name: data.profile.name,
          email: data.profile.email,
          preferredLanguage: data.profile.preferredLanguage,
          languagesSpoken: data.profile.languagesSpoken ? data.profile.languagesSpoken.join(', ') : '',
          avatar: data.profile.avatar || '',
          bio: data.bio || ''
        })

        setMetrics({
          height: data.bodyMetrics?.height || '',
          weight: data.bodyMetrics?.weight || '',
          age: data.bodyMetrics?.age || '',
          gender: data.bodyMetrics?.gender || 'Male',
          activityLevel: data.bodyMetrics?.activityLevel || 'Sedentary',
          goal: data.bodyMetrics?.goal || 'Weight Loss'
        })
      } catch (err) {
        setMessage(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const saveProfile = async () => {
    try {
      setSaving(true)
      const res = await fetch(`${API}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          preferredLanguage: profile.preferredLanguage,
          bio: profile.bio
        })
      })
      if (!res.ok) throw new Error('Failed to save profile')
      setMessage('Profile saved successfully')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const saveMetrics = async () => {
    try {
      setSaving(true)
      const res = await fetch(`${API}/users/metrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(metrics)
      })
      if (!res.ok) throw new Error('Failed to save metrics')
      setMessage('Metrics saved successfully')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setAvatarLoading(true)
    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        setProfile(prev => ({ ...prev, avatar: res.data.user.avatar }))
        // Update global auth state if needed, or simply let the local state reflect it
        setUser(res.data.user) // Update global auth state with new avatar
        setToastMessage('Avatar updated successfully')
      }
    } catch (error) {
      console.error(error)
      setToastMessage('Failed to upload avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-1 text-[14px]">Manage your personal details and body metrics.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-[20px] font-semibold text-white mb-6">Personal Details</h2>
          <div className="flex items-center gap-6 mb-8">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border border-[#1E293B]" />
            ) : (
              <div className="w-24 h-24 bg-[#0F172A] rounded-full flex items-center justify-center text-[32px] font-bold text-gray-400 border border-[#1E293B]">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="space-y-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                accept="image/jpeg, image/png, image/gif" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="px-4 py-2 border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors rounded-lg text-[14px] font-semibold cursor-pointer"
              >
                {avatarLoading ? 'Uploading...' : 'Change Avatar'}
              </button>
              <p className="text-[12px] text-gray-500">JPG, GIF or PNG. Max 5MB.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white"
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white opacity-60"
              />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Language Preference</label>
              <select
                value={profile.preferredLanguage}
                onChange={e => setProfile({ ...profile, preferredLanguage: e.target.value })}
                className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none"
              >
                <option>English</option><option>Malayalam</option><option>Hindi</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Bio</label>
              <textarea 
                rows="3" 
                placeholder="Tell us a bit about yourself..." 
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none bg-[#0F172A] text-white placeholder-gray-500"
              ></textarea>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-[20px] font-semibold text-white mb-6">Body Metrics & Goals</h2>
         <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Height (cm)</label>
              <input type="number" value={metrics.height} onChange={e => setMetrics({ ...metrics, height: e.target.value })} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white" />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Weight (kg)</label>
              <input type="number" value={metrics.weight} onChange={e => setMetrics({ ...metrics, weight: e.target.value })} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white" />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Age</label>
              <input type="number" value={metrics.age} onChange={e => setMetrics({ ...metrics, age: e.target.value })} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white" />
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Gender</label>
              <select value={metrics.gender} onChange={e => setMetrics({ ...metrics, gender: e.target.value })} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Activity Level</label>
              <select value={metrics.activityLevel} onChange={e => setMetrics({ ...metrics, activityLevel: e.target.value })} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none">
                <option>Sedentary</option><option>Lightly Active</option><option>Moderately Active</option><option>Very Active</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-gray-300 mb-2">Primary Goal</label>
              <select value={metrics.goal} onChange={e => setMetrics({ ...metrics, goal: e.target.value })} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none">
                <option>Weight Loss</option><option>Muscle Gain</option><option>Maintenance</option>
              </select>
            </div>
          </div>
        </Card>
        <div className="flex justify-end gap-4 items-center">
          {message && <p className="text-sm text-gray-400">{message}</p>}
          <button onClick={saveProfile} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button onClick={saveMetrics} disabled={saving} className="px-6 py-3 border border-[#1E293B] text-white hover:bg-[#0F172A] rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Metrics'}
          </button>
        </div>

        {/* Are you a trainer? */}
        <div className="mt-10 bg-[#0F172A]/50 border border-[#1E293B] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center shrink-0">
            <Dumbbell size={22} className="text-[#F97316]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-[16px] mb-1">Are you a trainer?</h3>
            <p className="text-gray-400 text-[13px]">Join FitForge as a coach and start getting matched with clients today.</p>
          </div>
          <Link
            to="/auth/trainer-register"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F97316] to-[#ff8c3a] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-200 shrink-0"
          >
            Register as Coach <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
