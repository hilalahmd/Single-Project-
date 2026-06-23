import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import Avatar from '../../../shared/components/Avatar'
import Modal from '../../../shared/components/Modal'

export default function SchedulePage() {
  const [view, setView] = useState('week')
  const [modalOpen, setModalOpen] = useState(false)

  const days = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18']
  const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Schedule</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming live sessions.</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>Book New Session</Button>
      </div>

      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"><ChevronLeft size={20} /></button>
          <h2 className="text-lg font-bold text-white">Oct 12 - Oct 18, 2026</h2>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"><ChevronRight size={20} /></button>
        </div>
        <div className="bg-gray-800 p-1 rounded-lg flex items-center hidden sm:flex">
          <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'week' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>Week</button>
          <button onClick={() => setView('month')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'month' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>Month</button>
        </div>
      </div>

      <Card padding="none" className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-gray-800">
            <div className="p-4 text-center border-r border-gray-800 bg-gray-800/50"></div>
            {days.map(d => (
              <div key={d} className="p-4 text-center border-r border-gray-800 last:border-0">
                <p className="font-bold text-gray-400 text-sm">{d.split(' ')[0]}</p>
                <p className="text-2xl font-black text-gray-600">{d.split(' ')[1]}</p>
              </div>
            ))}
          </div>
          {times.map(t => (
            <div key={t} className="grid grid-cols-8 border-b border-gray-800 last:border-0 h-24">
              <div className="p-2 text-center border-r border-gray-800 bg-gray-800/50 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">{t}</span>
              </div>
              {days.map((d, i) => (
                <div key={d} className="p-1 border-r border-gray-800 last:border-0 relative hover:bg-gray-800/30 transition-colors cursor-pointer group">
                  {t === '18:00' && i === 2 && (
                    <div className="absolute inset-2 bg-white text-black rounded-lg p-2 overflow-hidden z-10 hover:ring-2 ring-white ring-offset-2 ring-offset-gray-900 transition-all">
                      <p className="text-xs font-bold truncate">Arjun Menon</p>
                      <p className="text-[10px] text-gray-500">18:00 - 19:00</p>
                      <div className="absolute bottom-2 right-2"><Video size={12} /></div>
                    </div>
                  )}
                  {t === '08:00' && i === 5 && (
                    <div className="absolute inset-2 bg-white text-black rounded-lg p-2 overflow-hidden z-10 hover:ring-2 ring-white ring-offset-2 ring-offset-gray-900 transition-all">
                      <p className="text-xs font-bold truncate">Arjun Menon</p>
                      <p className="text-[10px] text-gray-500">08:00 - 09:00</p>
                      <div className="absolute bottom-2 right-2"><Video size={12} /></div>
                    </div>
                  )}
                  <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <span className="text-xl font-light text-gray-600">+</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Sessions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Arjun Menon', date: 'Wednesday, Oct 14', time: '6:00 PM - 7:00 PM', type: 'Form Correction' },
            { name: 'Arjun Menon', date: 'Saturday, Oct 17', time: '8:00 AM - 9:00 AM', type: 'Weekly Check-in' },
          ].map((s, i) => (
            <Card key={i} padding="lg">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} size="lg" />
                  <div>
                    <h3 className="font-bold text-white">{s.name}</h3>
                    <Badge label={s.type} variant="outline" className="mt-1 text-[10px]" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white justify-end"><CalendarIcon size={14}/> {s.date}</div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 justify-end mt-1"><Clock size={12}/> {s.time}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1"><Video size={16} className="mr-2" /> Join Call</Button>
                <Button variant="secondary" className="flex-1 text-sm">Reschedule</Button>
                <Button variant="secondary" className="text-red-500 border-red-900/50 hover:bg-red-900/20 text-sm">Cancel</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book New Session">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Select Coach</label>
            <select className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:border-white">
              <option>Arjun Menon (Active Plan)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">Select Date</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:border-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map(t => (
                <button key={t} className="p-2 border border-gray-700 rounded-md text-xs font-bold text-gray-400 hover:border-white hover:text-white focus:bg-white focus:text-black transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-800 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm Booking</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
