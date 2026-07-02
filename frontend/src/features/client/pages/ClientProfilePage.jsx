import { useState, useEffect } from 'react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import API from '../../../shared/utils/api'

export default function ClientProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    preferredLanguage: 'English'
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
          name: data.name || '',
          email: data.email || '',
          preferredLanguage: data.preferredLanguage || 'English'
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
          preferredLanguage: profile.preferredLanguage
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
            <div className="w-24 h-24 bg-[#0F172A] rounded-full flex items-center justify-center text-[32px] font-bold text-gray-400 border border-[#1E293B]">H</div>
            <div className="space-y-2">
              <button className="px-4 py-2 border border-[#1E293B] text-white hover:bg-[#0F172A] rounded-lg text-[14px] font-semibold transition-colors">Change Avatar</button>
              <p className="text-[14px] text-gray-400">JPG, GIF or PNG. Max size of 2MB.</p>
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
              <textarea rows="3" placeholder="Tell us a bit about yourself..." className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none bg-[#0F172A] text-white placeholder-gray-500"></textarea>
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
      </div>
    </div>
  )
}
