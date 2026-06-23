import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Upload, X, Check, FileText } from 'lucide-react'

const SPECIALTIES = [
  'Weight Loss', 'Muscle Building', 'HIIT', 'Yoga',
  'Nutrition', 'Rehabilitation', 'Sports', 'Flexibility',
]
const LANGUAGES = ['Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'English']

export default function TrainerRegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [files, setFiles] = useState([])
  const [bioLength, setBioLength] = useState(0)
  const [done, setDone] = useState(false)
  const fileRef = useRef()

  const toggleSpecialty = (s) =>
    setSelectedSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )

  const toggleLanguage = (l) =>
    setSelectedLanguages(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    )

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files)
    setFiles(prev => [...prev, ...picked])
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  if (done) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mx-auto shadow-xl">
          <Check size={32} className="text-white" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-black tracking-tight">Application Submitted!</h2>
          <p className="text-gray-500 mt-3 leading-relaxed max-w-sm mx-auto font-medium">
            Your trainer application is under review by the admin team.
            We'll notify you via email within <strong className="text-black">24–48 hours</strong>.
          </p>
        </div>
        <Link to="/auth/trainer-login" className="inline-block mt-4">
          <button className="px-8 py-3.5 bg-white border-2 border-gray-200 text-black font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            Back to Login
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-2xl mx-auto pb-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-black tracking-tight">Trainer Registration</h1>
        <p className="text-gray-500 mt-2 font-medium">Submit your professional profile to join FitForge.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* ── Personal Info ── */}
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-300"></span> Personal Info
          </h2>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" placeholder="e.g. Jane Smith" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                <div className="flex bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors overflow-hidden">
                  <div className="px-4 py-3 border-r border-gray-200 bg-gray-100 text-gray-500 font-bold text-sm">+91</div>
                  <input type="tel" placeholder="9876543210" maxLength={10} className="w-full px-4 py-3 bg-transparent text-black focus:outline-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input type="email" placeholder="e.g. jane@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors overflow-hidden">
                  <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" className="w-full px-4 py-3 bg-transparent text-black focus:outline-none" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="px-4 text-gray-400 hover:text-black transition-colors">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors overflow-hidden">
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" className="w-full px-4 py-3 bg-transparent text-black focus:outline-none" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-4 text-gray-400 hover:text-black transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Professional Info ── */}
        <div className="p-8 border-b border-gray-100 bg-[#FAFAFA]">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-300"></span> Professional Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Years of Experience</label>
              <input type="number" placeholder="e.g. 5" min="0" className="w-full sm:w-1/3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Core Specialties (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => {
                  const active = selectedSpecialties.includes(s)
                  return (
                    <button
                      key={s} type="button" onClick={() => toggleSpecialty(s)}
                      className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all ${
                        active ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black shadow-sm'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Preferred Coaching Languages</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LANGUAGES.map(l => {
                  const checked = selectedLanguages.includes(l)
                  return (
                    <label key={l} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${checked ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-black'}`}>
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-black border-black' : 'border-gray-300'}`}>
                        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-sm font-bold ${checked ? 'text-black' : 'text-gray-600'}`}>{l}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Bio</label>
                <span className={`text-xs font-bold ${bioLength >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                  {bioLength}/100 min
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="Detail your training philosophy, methodologies, and achievements..."
                onChange={e => setBioLength(e.target.value.length)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── Certifications & Documents ── */}
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-300"></span> Certifications & Documents
          </h2>
          
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl hover:border-black hover:bg-gray-50 transition-all p-10 text-center cursor-pointer group"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-black transition-all">
              <Upload size={24} className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-base font-bold text-black mb-1">Upload Certifications & ID</p>
            <p className="text-sm text-gray-500 font-medium">Click to browse. PDF, JPG, or PNG allowed.</p>
            <input ref={fileRef} type="file" accept=".pdf,image/*" multiple onChange={handleFiles} className="hidden" />
          </div>

          {files.length > 0 && (
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={18} className="text-blue-600 shrink-0" />
                    <span className="text-sm font-bold text-black truncate">{f.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Pricing ── */}
        <div className="p-8 bg-[#FAFAFA]">
          <h2 className="text-sm font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-300"></span> Expected Pricing <span className="text-gray-400 normal-case tracking-normal">(Per Month)</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Wellness Plan</label>
              <div className="flex bg-white border border-gray-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors overflow-hidden">
                <div className="px-4 py-3 border-r border-gray-200 bg-gray-50 text-gray-500 font-bold text-sm">₹</div>
                <input type="number" placeholder="499" className="w-full px-4 py-3 bg-transparent text-black focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Personal Training Plan</label>
              <div className="flex bg-white border border-gray-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors overflow-hidden">
                <div className="px-4 py-3 border-r border-gray-200 bg-gray-50 text-gray-500 font-bold text-sm">₹</div>
                <input type="number" placeholder="2499" className="w-full px-4 py-3 bg-transparent text-black focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button onClick={() => setDone(true)} className="w-full py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-800 hover:shadow-xl transition-all active:scale-[0.98]">
          Submit Application for Review
        </button>
        <p className="text-center text-sm text-gray-500 font-medium mt-6">
          Already registered?{' '}
          <Link to="/auth/trainer-login" className="font-bold text-black hover:underline underline-offset-4">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
