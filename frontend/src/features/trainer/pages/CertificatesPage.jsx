import { Award, Plus, CheckCircle, Clock } from 'lucide-react'

const CERTS = [
  { name: 'NASM Certified Personal Trainer',  issuer: 'NASM',  year: 2021, status: 'Verified' },
  { name: 'CrossFit Level 2 Trainer',          issuer: 'CrossFit HQ', year: 2022, status: 'Verified' },
  { name: 'Precision Nutrition Level 1',        issuer: 'Precision Nutrition', year: 2023, status: 'Pending' },
]

export default function CertificatesPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Certificates</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage your professional certifications and documents.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white text-[14px] font-bold rounded-lg transition-all shadow-sm">
          <Plus size={18} /> Add Certificate
        </button>
      </div>

      <div className="space-y-4">
        {CERTS.map(c => (
          <div key={c.name} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 flex items-center gap-6 shadow-sm hover:border-[#F97316] transition-colors">
            <div className="w-14 h-14 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0 border border-[#1E293B]">
              <Award size={24} className="text-[#F97316]" />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-white">{c.name}</p>
              <p className="text-[14px] text-gray-400 mt-0.5 font-medium">{c.issuer} · {c.year}</p>
            </div>
            <span className={`px-3 py-1 text-[12px] font-bold rounded-full flex items-center gap-1.5 ${
              c.status === 'Verified' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {c.status === 'Verified' ? <CheckCircle size={14} /> : <Clock size={14} />}
              {c.status}
            </span>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-[#1E293B] bg-white/5 rounded-2xl p-10 text-center hover:border-[#F97316] hover:bg-white/10 transition-all cursor-pointer group mt-8">
        <div className="w-16 h-16 bg-[#0F172A] border border-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
          <Award size={28} className="text-gray-500 group-hover:text-[#F97316] transition-colors" />
        </div>
        <p className="text-[16px] font-bold text-white">Drag & drop certificate PDF or image</p>
        <p className="text-[14px] text-gray-400 mt-2 font-medium">PDF, JPG, PNG up to 5MB</p>
        <button className="mt-6 px-6 py-3 border border-[#1E293B] bg-[#0F172A] text-gray-300 text-[14px] font-bold hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors shadow-sm">
          Browse Files
        </button>
      </div>
    </div>
  )
}
