import { useState } from 'react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'

export default function ClientSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1 text-[14px]">Manage your account preferences and details.</p>
      </div>

      <div className="border-b border-[#1E293B] flex gap-8 overflow-x-auto">
        {['profile', 'notifications', 'security', 'subscription'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[14px] font-semibold capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2563EB] rounded-t-full" />}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'profile' && (
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
                {[
                  { l: 'Full Name', v: 'Hilal', t: 'text' },
                  { l: 'Email Address', v: 'hilal@example.com', t: 'email', ro: true },
                  { l: 'Phone Number', v: '+91 9876543210', t: 'tel' },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[14px] font-semibold text-gray-300 mb-2">{f.l}</label>
                    <input type={f.t} defaultValue={f.v} readOnly={f.ro} className={`w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white ${f.ro ? 'opacity-60' : ''}`} />
                  </div>
                ))}
                <div>
                  <label className="block text-[14px] font-semibold text-gray-300 mb-2">Language Preference</label>
                  <select className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none">
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
                {[
                  { l: 'Height (cm)', v: 175 }, { l: 'Weight (kg)', v: 74.5 }, { l: 'Age', v: 28 }
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[14px] font-semibold text-gray-300 mb-2">{f.l}</label>
                    <input type="number" defaultValue={f.v} className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white" />
                  </div>
                ))}
                {[
                  { l: 'Gender', opts: ['Male', 'Female', 'Other'] },
                  { l: 'Activity Level', opts: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
                  { l: 'Primary Goal', opts: ['Weight Loss', 'Muscle Gain', 'Maintenance'] },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[14px] font-semibold text-gray-300 mb-2">{f.l}</label>
                    <select className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none">
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <h2 className="text-[20px] font-semibold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-2">
              {[
                { title: 'Email Notifications', desc: 'Receive daily summaries and important updates via email.' },
                { title: 'SMS Notifications', desc: 'Get SMS alerts for upcoming live sessions.' },
                { title: 'Push Notifications', desc: 'Allow browser push notifications for real-time alerts.' },
                { title: 'Workout Reminders', desc: 'Remind me 1 hour before scheduled workouts.' },
                { title: 'Coach Messages', desc: 'Notify me when my coach sends a direct message.' },
                { title: 'Plan Updates', desc: 'Notify me when my coach updates my diet or workout plan.' },
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

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-[20px] font-semibold text-white mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">
                {['Current Password', 'New Password', 'Confirm New Password'].map((l, i) => (
                  <div key={i}>
                    <label className="block text-[14px] font-semibold text-gray-300 mb-2">{l}</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#0F172A] text-white placeholder-gray-500" />
                  </div>
                ))}
                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">Update Password</button>
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
                  <button className="px-4 py-2 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg text-[14px] font-semibold transition-colors">Revoke</button>
                </div>
              </div>
            </Card>
          </div>
        )}

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
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">Upgrade to PT</button>
                <button className="px-6 py-3 border border-[#1E293B] text-white hover:bg-[#0F172A] rounded-lg text-[14px] font-semibold transition-colors">Cancel Plan</button>
              </div>
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
