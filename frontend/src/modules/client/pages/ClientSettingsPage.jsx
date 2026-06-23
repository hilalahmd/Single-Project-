import { useState } from 'react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'

export default function ClientSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and details.</p>
      </div>

      <div className="border-b border-gray-800 flex gap-8 overflow-x-auto">
        {['profile', 'notifications', 'security', 'subscription'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full" />}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-white mb-6">Personal Details</h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-2xl font-black text-gray-500 border border-gray-700">H</div>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm">Change Avatar</Button>
                  <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { l: 'Full Name', v: 'Hilal', t: 'text' },
                  { l: 'Email Address', v: 'hilal@example.com', t: 'email', ro: true },
                  { l: 'Phone Number', v: '+91 9876543210', t: 'tel' },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-sm font-bold text-gray-300 mb-1">{f.l}</label>
                    <input type={f.t} defaultValue={f.v} readOnly={f.ro} className={`w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white bg-gray-800 text-white ${f.ro ? 'opacity-60' : ''}`} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Language Preference</label>
                  <select className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:border-white appearance-none">
                    <option>English</option><option>Malayalam</option><option>Hindi</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-1">Bio</label>
                  <textarea rows="3" placeholder="Tell us a bit about yourself..." className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white resize-none bg-gray-800 text-white placeholder-gray-600"></textarea>
                </div>
              </div>
            </Card>
            <Card padding="lg">
              <h2 className="text-xl font-bold text-white mb-6">Body Metrics & Goals</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { l: 'Height (cm)', v: 175 }, { l: 'Weight (kg)', v: 74.5 }, { l: 'Age', v: 28 }
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-sm font-bold text-gray-300 mb-1">{f.l}</label>
                    <input type="number" defaultValue={f.v} className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white bg-gray-800 text-white" />
                  </div>
                ))}
                {[
                  { l: 'Gender', opts: ['Male', 'Female', 'Other'] },
                  { l: 'Activity Level', opts: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
                  { l: 'Primary Goal', opts: ['Weight Loss', 'Muscle Gain', 'Maintenance'] },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-sm font-bold text-gray-300 mb-1">{f.l}</label>
                    <select className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:border-white appearance-none">
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex justify-end"><Button variant="primary">Save Changes</Button></div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card padding="lg">
            <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              {[
                { title: 'Email Notifications', desc: 'Receive daily summaries and important updates via email.' },
                { title: 'SMS Notifications', desc: 'Get SMS alerts for upcoming live sessions.' },
                { title: 'Push Notifications', desc: 'Allow browser push notifications for real-time alerts.' },
                { title: 'Workout Reminders', desc: 'Remind me 1 hour before scheduled workouts.' },
                { title: 'Coach Messages', desc: 'Notify me when my coach sends a direct message.' },
                { title: 'Plan Updates', desc: 'Notify me when my coach updates my diet or workout plan.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                  <div className="pr-8">
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i % 2 === 0} />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white peer-checked:after:bg-black"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end"><Button variant="primary">Save Preferences</Button></div>
          </Card>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">
                {['Current Password', 'New Password', 'Confirm New Password'].map((l, i) => (
                  <div key={i}>
                    <label className="block text-sm font-bold text-gray-300 mb-1">{l}</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white bg-gray-800 text-white placeholder-gray-600" />
                  </div>
                ))}
                <Button variant="primary" className="mt-4">Update Password</Button>
              </div>
            </Card>
            <Card padding="lg">
              <h2 className="text-xl font-bold text-white mb-6">Active Sessions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl bg-gray-800/50">
                  <div><p className="font-bold text-white">Windows 11 • Chrome</p><p className="text-xs text-gray-500">Current Session • Kochi, India</p></div>
                  <Badge label="Active Now" variant="active" />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-800 rounded-xl">
                  <div><p className="font-bold text-white">iPhone 14 • Safari</p><p className="text-xs text-gray-500">Last active 2 days ago • Kochi, India</p></div>
                  <Button variant="secondary" size="sm" className="text-red-500 border-red-900/50 hover:bg-red-900/20">Revoke</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-8">
            <Card padding="lg" className="!border-white shadow-lg shadow-white/5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge label="Active" variant="active" className="mb-2" />
                  <h2 className="text-2xl font-black text-white">Wellness Plan</h2>
                  <p className="text-gray-500 mt-1">₹999 / month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">Next billing date</p>
                  <p className="text-sm text-gray-500">Nov 15, 2026</p>
                </div>
              </div>
              <div className="space-y-4 mb-8 pt-6 border-t border-gray-800">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1"><span className="text-gray-400">AI Diet Generations Used</span><span className="text-white">3 / Unlimited</span></div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: '10%' }}></div></div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="primary">Upgrade to PT</Button>
                <Button variant="secondary">Cancel Plan</Button>
              </div>
            </Card>
            <Card padding="lg">
              <h3 className="text-lg font-bold text-white mb-4">Billing History</h3>
              <div className="text-center py-8 text-gray-500 text-sm font-medium">No previous invoices found.</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
