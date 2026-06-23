import { Award, Plus, CheckCircle, Clock } from 'lucide-react'

const CERTS = [
  { name: 'NASM Certified Personal Trainer',  issuer: 'NASM',  year: 2021, status: 'Verified' },
  { name: 'CrossFit Level 2 Trainer',          issuer: 'CrossFit HQ', year: 2022, status: 'Verified' },
  { name: 'Precision Nutrition Level 1',        issuer: 'Precision Nutrition', year: 2023, status: 'Pending' },
]

export default function CertificatesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">Certificates</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      <div className="space-y-3">
        {CERTS.map(c => (
          <div key={c.name} className="flex items-center gap-4 border border-gray-200 px-5 py-4">
            <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
              <Award size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-black">{c.name}</p>
              <p className="text-xs text-gray-500">{c.issuer} · {c.year}</p>
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 border ${
              c.status === 'Verified'
                ? 'border-black text-black'
                : 'border-gray-300 text-gray-500'
            }`}>
              {c.status === 'Verified' ? <CheckCircle size={12} /> : <Clock size={12} />}
              {c.status}
            </span>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-200 p-8 text-center hover:border-black transition-colors cursor-pointer">
        <Award size={24} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Drag & drop certificate PDF or image</p>
        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
        <button className="mt-3 px-4 py-2 border border-gray-300 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition-colors">
          Browse Files
        </button>
      </div>
    </div>
  )
}
