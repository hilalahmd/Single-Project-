import { useState } from 'react'
import Card from '../../../shared/components/Card'
import Badge from '../../../shared/components/Badge'
import API from '../../../shared/utils/api'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ClientSettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications')

  // ── Password Change State ─────────────────────────────────────────────
  const [currentPassword,  setCurrentPassword]  = useState('')
  const [newPassword,      setNewPassword]      = useState('')
  const [confirmPassword,  setConfirmPassword]  = useState('')
  const [pwLoading,        setPwLoading]        = useState(false)
  const [pwError,          setPwError]          = useState('')
  const [pwSuccess,        setPwSuccess]        = useState('')

  const handleUpdatePassword = async () => {
    setPwError('')
    setPwSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('All three fields are required.')
      return
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }

    setPwLoading(true)
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        setPwSuccess('Password updated successfully.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPwError(data?.message || 'Failed to update password.')
      }
    } catch {
      setPwError('Network error. Please try again.')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1 text-[14px]">Manage your account preferences and details.</p>
      </div>

      <div className="border-b border-[#1E293B] flex gap-8 overflow-x-auto">
        {['notifications', 'security', 'subscription'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[14px] font-semibold capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2563EB] rounded-t-full" />}
          </button>
        ))}
      </div>

      <div>

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === 'notifications' && (
          <Card>
            <h2 className="text-[20px] font-semibold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-2">
              {[
                { title: 'Email Notifications',  desc: 'Receive daily summaries and important updates via email.' },
                { title: 'SMS Notifications',    desc: 'Get SMS alerts for upcoming live sessions.' },
                { title: 'Push Notifi cations',   desc: 'Allow browser push notifications for real-time alerts.' },
                { title: 'Workout Reminders',    desc: 'Remind me 1 hour before scheduled workouts.' },
                { title: 'Coach Messages',       desc: 'Notify me when my coach sends a direct message.' },
                { title: 'Plan Updates',         desc: 'Notify me when my coach updates my diet or workout plan.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[#1E293B] last:border-0">
                  <div className="pr-8">
                    <p className="font-semibold text-[16px] text-white">{item.title}</p>
                    <p className="text-[14px] text-gray-400 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i % 2 === 0} />
                    <div className="w-11 h-6 bg-[#0F172A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB] peer-checked:after:bg-white border border-[#1E293B]"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">Save Preferences</button>
            </div>
          </Card>
        )}

        {/* ── SECURITY TAB ── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-[20px] font-semibold text-white mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">

                <div>
                  <label className="block text-[14px] font-semibold text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => { setCurrentPassword(e.target.value); setPwError(''); setPwSuccess('') }}
                    className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white placeholder-gray-500"
                    autoComplete="current-password"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPwError(''); setPwSuccess('') }}
                    className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white placeholder-gray-500"
                    autoComplete="new-password"
                  />
                  <p className="text-[12px] text-gray-500 mt-1">Minimum 8 characters.</p>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setPwError(''); setPwSuccess('') }}
                    className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white placeholder-gray-500"
                    autoComplete="new-password"
                  />
                </div>

                {/* Inline error / success */}
                {pwError && (
                  <div className="flex items-center gap-2 text-red-400 text-[13px] bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{pwError}</span>
                  </div>
                )}
                {pwSuccess && (
                  <div className="flex items-center gap-2 text-green-400 text-[13px] bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2.5">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span>{pwSuccess}</span>
                  </div>
                )}

                <button
                  onClick={handleUpdatePassword}
                  disabled={pwLoading}
                  className="mt-2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pwLoading && <Loader2 size={15} className="animate-spin" />}
                  {pwLoading ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </Card>

            <Card>
              <h2 className="text-[20px] font-semibold text-white mb-6">Active Sessions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[#1E293B] rounded-xl bg-[#0F172A]">
                  <div><p className="font-semibold text-[16px] text-white">Windows 11 • Chrome</p><p className="text-[14px] text-gray-400 mt-1">Current Session • Kochi, India</p></div>
                  <Badge label="Active Now" variant="active" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20" />
                </div>
                <div className="flex items-center justify-between p-4 border border-[#1E293B] rounded-xl bg-[#111827]">
                  <div><p className="font-semibold text-[16px] text-white">iPhone 14 • Safari</p><p className="text-[14px] text-gray-400 mt-1">Last active 2 days ago • Kochi, India</p></div>
                  <button
                    disabled
                    title="Session management coming soon"
                    className="px-4 py-2 border border-[#EF4444]/20 text-[#EF4444]/40 rounded-lg text-[14px] font-semibold cursor-not-allowed opacity-50"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── SUBSCRIPTION TAB ── */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <Card className="border-[#2563EB]/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge label="Active" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 mb-3" />
                  <h2 className="text-[24px] font-bold text-white">Wellness Plan</h2>
                  <p className="text-[16px] text-gray-400 mt-1">₹999 / month</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-white">Next billing date</p>
                  <p className="text-[14px] text-gray-400 mt-1">Nov 15, 2026</p>
                </div>
              </div>
              <div className="space-y-4 mb-8 pt-6 border-t border-[#1E293B]">
                <div>
                  <div className="flex justify-between text-[14px] font-semibold mb-2"><span className="text-gray-400">AI Diet Generations Used</span><span className="text-white">3 / Unlimited</span></div>
                  <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B]"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: '10%' }}></div></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Upgrade to PT — no backend yet */}
                <div className="relative group">
                  <button
                    disabled
                    className="px-6 py-3 bg-gradient-to-r from-[#2563EB]/40 to-blue-500/40 text-white/50 rounded-lg text-[14px] font-semibold cursor-not-allowed"
                  >
                    Upgrade to PT
                  </button>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold bg-[#1E293B] text-amber-400 border border-amber-500/20 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Coming soon
                  </span>
                </div>

                {/* Cancel Plan — no backend yet */}
                <div className="relative group">
                  <button
                    disabled
                    className="px-6 py-3 border border-[#1E293B] text-gray-600 rounded-lg text-[14px] font-semibold cursor-not-allowed"
                  >
                    Cancel Plan
                  </button>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold bg-[#1E293B] text-amber-400 border border-amber-500/20 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Coming soon
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-gray-500 mt-4">
                Subscription management is coming soon. To make changes to your plan, contact{' '}
                <a href="mailto:support@fitforge.in" className="text-[#2563EB] hover:underline">support@fitforge.in</a>.
              </p>
            </Card>

            <Card>
              <h3 className="text-[20px] font-semibold text-white mb-6">Billing History</h3>
              <div className="text-center py-12 text-gray-500 text-[14px] bg-[#0F172A] rounded-xl border border-[#1E293B]">No previous invoices found.</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
