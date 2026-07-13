import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Check, FileText, Loader2, AlertCircle } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function TrainerResubmitPage() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  const [files, setFiles] = useState([])
  const fileRef = useRef()
  
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    const reason = sessionStorage.getItem('rejectionReason')
    if (reason) setRejectionReason(reason)
  }, [])

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files)
    setFiles(prev => [...prev, ...picked])
  }
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleResubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      if (bio) formData.append('bio', bio)
      if (experience) formData.append('experience', experience)
      
      files.forEach(f => {
        formData.append('certifications', f)
      })

      const res = await fetch(`${API}/trainers/resubmit`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to resubmit application')
      }
      
      setDone(true)
    } catch (error) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#07080C] flex flex-col text-white font-['Inter'] flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 rounded-full bg-orange-600 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(249,115,22,0.6)]">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white font-['Syne'] tracking-tight">Application Resubmitted</h2>
            <p className="text-gray-400 mt-4 leading-relaxed font-medium">
              Your profile is back under review. We'll notify you via email soon.
            </p>
          </div>
          <Link to="/auth/trainer-login" className="inline-block mt-4">
            <button className="px-8 py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/30">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-white font-['Inter'] flex flex-col items-center py-12 px-4">
      <div className="max-w-xl w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-['Syne']">Resubmit Application</h1>
          <p className="text-gray-400 mt-2">Please update your details and submit again.</p>
        </div>

        {rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-red-500">Rejection Reason</h3>
              <p className="text-sm text-red-400 mt-1">{rejectionReason}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Updated Short Bio (Optional)</label>
            <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 focus-within:border-orange-500/50 transition-colors">
              <textarea rows={3} placeholder="Your training philosophy..." value={bio} onChange={e => setBio(e.target.value)} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 resize-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Updated Experience (Optional)</label>
            <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 focus-within:border-orange-500/50 transition-colors w-1/2">
              <input type="number" placeholder="e.g. 5" min="0" value={experience} onChange={e => setExperience(e.target.value)} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">New Certifications (Optional)</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-[#1E293B] rounded-2xl hover:border-orange-500 hover:bg-orange-500/5 transition-all p-6 text-center cursor-pointer group bg-[#030712]/50">
              <Upload size={24} className="text-gray-400 group-hover:text-white transition-colors mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-1">Upload Documents</p>
              <input ref={fileRef} type="file" accept=".pdf,image/*" multiple onChange={handleFiles} className="hidden" />
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#030712] border border-[#1E293B] rounded-xl">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-orange-500 shrink-0" />
                      <span className="text-xs font-medium text-gray-300">{f.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="text-gray-500 hover:text-red-400 p-1">X</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button onClick={handleResubmit} disabled={submitting} className={`w-full py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span>{submitting ? 'Resubmitting...' : 'Resubmit Application'}</span>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} className="group-hover:scale-110 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  )
}
