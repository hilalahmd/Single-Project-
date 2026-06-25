import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Badge from '../../../shared/components/Badge'
import Avatar from '../../../shared/components/Avatar'
import Modal from '../../../shared/components/Modal'

export default function SchedulePage() {
  const [view, setView] = useState('week')
  const [modalOpen, setModalOpen] = useState(false)

  const days = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18']
  const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-white">Schedule</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage your upcoming live sessions.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">Book New Session</button>
      </div>

      <div className="flex justify-between items-center bg-[#111827] p-4 rounded-xl border border-[#1E293B] shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400"><ChevronLeft size={20} /></button>
          <h2 className="text-[16px] font-semibold text-white">Oct 12 - Oct 18, 2026</h2>
          <button className="p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400"><ChevronRight size={20} /></button>
        </div>
        <div className="bg-[#0F172A] p-1 rounded-lg flex items-center hidden sm:flex border border-[#1E293B]">
          <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-md text-[14px] font-semibold transition-all ${view === 'week' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>Week</button>
          <button onClick={() => setView('month')} className={`px-4 py-1.5 rounded-md text-[14px] font-semibold transition-all ${view === 'month' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>Month</button>
        </div>
      </div>

      <Card padding="none" className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-[#1E293B]">
            <div className="p-4 text-center border-r border-[#1E293B] bg-[#0F172A]"></div>
            {days.map(d => (
              <div key={d} className="p-4 text-center border-r border-[#1E293B] last:border-0 bg-[#0F172A]">
                <p className="font-semibold text-gray-400 text-[14px]">{d.split(' ')[0]}</p>
                <p className="text-[24px] font-bold text-white mt-1">{d.split(' ')[1]}</p>
              </div>
            ))}
          </div>
          {times.map(t => (
            <div key={t} className="grid grid-cols-8 border-b border-[#1E293B] last:border-0 h-24">
              <div className="p-2 text-center border-r border-[#1E293B] bg-[#0F172A] flex items-center justify-center">
                <span className="text-[12px] font-semibold text-gray-500">{t}</span>
              </div>
              {days.map((d, i) => (
                <div key={d} className="p-1 border-r border-[#1E293B] last:border-0 relative hover:bg-[#0F172A] transition-colors cursor-pointer group bg-[#111827]">
                  {t === '18:00' && i === 2 && (
                    <div className="absolute inset-2 bg-[#2563EB] text-white rounded-lg p-2 overflow-hidden z-10 shadow-lg border border-blue-400 transition-all hover:scale-[1.02]">
                      <p className="text-[12px] font-semibold truncate">Arjun Menon</p>
                      <p className="text-[10px] text-blue-100 mt-0.5">18:00 - 19:00</p>
                      <div className="absolute bottom-2 right-2"><Video size={12} className="text-white" /></div>
                    </div>
                  )}
                  {t === '08:00' && i === 5 && (
                    <div className="absolute inset-2 bg-[#2563EB] text-white rounded-lg p-2 overflow-hidden z-10 shadow-lg border border-blue-400 transition-all hover:scale-[1.02]">
                      <p className="text-[12px] font-semibold truncate">Arjun Menon</p>
                      <p className="text-[10px] text-blue-100 mt-0.5">08:00 - 09:00</p>
                      <div className="absolute bottom-2 right-2"><Video size={12} className="text-white" /></div>
                    </div>
                  )}
                  <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <span className="text-[20px] font-light text-gray-500">+</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="text-[20px] font-semibold text-white mb-6">Upcoming Sessions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: 'Arjun Menon', date: 'Wednesday, Oct 14', time: '6:00 PM - 7:00 PM', type: 'Form Correction' },
            { name: 'Arjun Menon', date: 'Saturday, Oct 17', time: '8:00 AM - 9:00 AM', type: 'Weekly Check-in' },
          ].map((s, i) => (
            <Card key={i}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <Avatar name={s.name} size="lg" className="border-[#1E293B]" />
                  <div>
                    <h3 className="font-semibold text-[16px] text-white">{s.name}</h3>
                    <Badge label={s.type} className="mt-2 bg-[#0F172A] border-[#1E293B] text-gray-300" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-[14px] font-semibold text-white justify-end"><CalendarIcon size={14} className="text-gray-400"/> {s.date}</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-400 justify-end mt-1.5"><Clock size={12}/> {s.time}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all"><Video size={16} className="mr-2" /> Join Call</button>
                <button className="flex-1 px-4 py-2.5 border border-[#1E293B] text-white hover:bg-[#0F172A] rounded-lg text-[14px] font-semibold transition-colors">Reschedule</button>
                <button className="px-4 py-2.5 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg text-[14px] font-semibold transition-colors">Cancel</button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book New Session">
        <div className="space-y-6">
          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-2">Select Coach</label>
            <select className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none">
              <option>Arjun Menon (Active Plan)</option>
            </select>
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-2">Select Date</label>
            <input type="date" className="w-full px-4 py-3 border border-[#1E293B] rounded-lg text-[14px] bg-[#0F172A] text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-gray-300 mb-2">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map(t => (
                <button key={t} className="p-3 border border-[#1E293B] bg-[#0F172A] rounded-lg text-[12px] font-semibold text-gray-400 hover:border-[#2563EB] hover:text-[#2563EB] focus:border-[#2563EB] focus:text-[#2563EB] focus:bg-[#2563EB]/10 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-[#1E293B] flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="px-6 py-3 border border-[#1E293B] text-white hover:bg-[#0F172A] rounded-lg text-[14px] font-semibold transition-colors">Cancel</button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">Confirm Booking</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
