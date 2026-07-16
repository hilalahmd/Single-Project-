import { useState, useEffect } from 'react'
import { Award, FileText, ExternalLink, Loader, ImageOff } from 'lucide-react'
import { apiClient as api } from '../../../shared/utils/api'

// Cloudinary URL-il ninnu file type determine cheyyunnu
const getFileType = (url) => {
  if (!url) return 'unknown'
  const lower = url.toLowerCase()
  if (lower.includes('.pdf') || lower.includes('/raw/')) return 'pdf'
  return 'image'
}

export default function CertificatesPage() {
  const [certUrls, setCertUrls] = useState([])
  const [profilePhoto, setProfilePhoto] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/trainers/me/profile')
      const trainer = res.data
      setCertUrls(trainer.certifications || [])
      setProfilePhoto(trainer.profilePhoto || '')
    } catch (err) {
      console.error('Failed to load certificates:', err)
      setError('Could not load certificates. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin text-[#F97316]" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Certificates</h1>
          <p className="text-[14px] text-gray-400 mt-1">Your uploaded professional certifications stored securely via Cloudinary.</p>
        </div>
      </div>

      {/* Profile Photo Section */}
      {profilePhoto && (
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 flex items-center gap-5">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-20 h-20 rounded-xl object-cover border border-[#1E293B] shadow"
          />
          <div>
            <p className="text-[15px] font-bold text-white">Profile Photo</p>
            <p className="text-[13px] text-gray-400 mt-0.5">Stored on Cloudinary · Only URL saved in MongoDB</p>
            <a
              href={profilePhoto}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] text-[#F97316] font-semibold mt-2 hover:underline"
            >
              <ExternalLink size={12} /> View on Cloudinary
            </a>
          </div>
        </div>
      )}

      {/* Certificates */}
      {certUrls.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-[#1E293B] rounded-2xl">
          <Award size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-base font-semibold">No certificates uploaded yet.</p>
          <p className="text-sm mt-1 text-gray-500">Certificates are uploaded during trainer registration.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-4">
            {certUrls.length} Certificate{certUrls.length > 1 ? 's' : ''} Found
          </p>
          <div className="space-y-4">
            {certUrls.map((url, index) => {
              const type = getFileType(url)
              return (
                <div
                  key={index}
                  className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 flex items-center gap-5 hover:border-[#F97316]/50 transition-colors"
                >
                  {/* Preview or Icon */}
                  <div className="w-16 h-16 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center shrink-0 overflow-hidden">
                    {type === 'image' ? (
                      <img
                        src={url}
                        alt={`Certificate ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full items-center justify-center ${type === 'image' ? 'hidden' : 'flex'}`}>
                      {type === 'pdf' ? (
                        <FileText size={24} className="text-[#F97316]" />
                      ) : (
                        <ImageOff size={24} className="text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-white truncate">
                      Certificate {index + 1}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-0.5 uppercase tracking-wider font-semibold">
                      {type === 'pdf' ? 'PDF Document' : 'Image File'} · Cloudinary
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1 truncate">{url}</p>
                  </div>

                  {/* Badge + Action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Uploaded
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[12px] text-[#F97316] font-semibold hover:underline"
                    >
                      <ExternalLink size={12} /> View
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex items-start gap-3">
        <Award size={18} className="text-[#F97316] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-bold text-white">Storage Optimized</p>
          <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">
            All certificates are stored on <span className="text-[#F97316] font-semibold">Cloudinary CDN</span>. Only the secure URL is saved in MongoDB, keeping your database fast and lightweight.
          </p>
        </div>
      </div>
    </div>
  )
}
