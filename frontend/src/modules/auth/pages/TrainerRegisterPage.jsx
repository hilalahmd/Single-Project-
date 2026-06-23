import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Upload, X, Check } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Input from '../../../shared/components/Input'

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
      <div className="text-center space-y-5 py-6">
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto">
          <Check size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Application Submitted!</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
            Your application is under review.
            We'll notify you via email within <strong>24–48 hours</strong>.
          </p>
        </div>
        <Link to="/auth/trainer-login">
          <Button variant="outline" fullWidth>Back to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-black text-black">Trainer Registration</h1>
        <p className="text-sm text-gray-500 mt-0.5">Submit your application to join FitForge.</p>
      </div>

      {/* ── Personal Info ── */}
      <section>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
          Personal Info
        </p>
        <div className="space-y-4">
          <Input label="Full Name" type="text" placeholder="Jane Smith" />
          <Input label="Email" type="email" placeholder="jane@example.com" />
          <Input label="Phone" type="tel" placeholder="9876543210" prefix="+91" maxLength={10} />
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
            <div className="flex items-center border border-gray-300 focus-within:border-black transition-colors">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="px-3 text-gray-400 hover:text-black transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Confirm Password</label>
            <div className="flex items-center border border-gray-300 focus-within:border-black transition-colors">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-3 text-gray-400 hover:text-black transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Info ── */}
      <section>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
          Professional Info
        </p>
        <div className="space-y-4">
          <Input label="Years of Experience" type="number" placeholder="5" min="0" />

          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(s => {
                const active = selectedSpecialties.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Bio</label>
              <span className={`text-xs ${bioLength >= 100 ? 'text-black' : 'text-gray-400'}`}>
                {bioLength}/100 min
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Tell clients about your training philosophy, experience, and approach..."
              onChange={e => setBioLength(e.target.value.length)}
              className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors resize-none bg-white"
            />
          </div>
        </div>
      </section>

      {/* ── Languages ── */}
      <section>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
          Languages
        </p>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map(l => {
            const checked = selectedLanguages.includes(l)
            return (
              <label
                key={l}
                className="flex items-center gap-3 px-3 py-2.5 border border-gray-200 cursor-pointer hover:border-black transition-colors"
              >
                <div
                  onClick={() => toggleLanguage(l)}
                  className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    checked ? 'bg-black border-black' : 'border-gray-300'
                  }`}
                >
                  {checked && <Check size={10} className="text-white" />}
                </div>
                <span className="text-sm text-gray-700">{l}</span>
              </label>
            )
          })}
        </div>
      </section>

      {/* ── Certifications ── */}
      <section>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
          Certifications
        </p>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-black transition-colors p-6 text-center cursor-pointer"
        >
          <Upload size={20} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-600">Upload Certificate PDF / Image</p>
          <p className="text-xs text-gray-400 mt-0.5">Click to browse. Multiple files allowed.</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700 truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-black transition-colors ml-2 shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Pricing ── */}
      <section>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
          Pricing
        </p>
        <div className="space-y-4">
          <Input label="Wellness Plan (monthly)" type="number" placeholder="499" prefix="₹" />
          <Input label="Personal Training Plan (monthly)" type="number" placeholder="999" prefix="₹" />
        </div>
      </section>

      <Button variant="primary" fullWidth onClick={() => setDone(true)}>
        Submit for Review
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already registered?{' '}
        <Link to="/auth/trainer-login" className="font-semibold text-black underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}
