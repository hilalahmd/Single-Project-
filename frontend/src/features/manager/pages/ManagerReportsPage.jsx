import { useState, useEffect } from 'react'
import { Check, X, ShieldAlert, Eye, MessageSquareWarning } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function ManagerReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API}/reports`, { credentials: 'include' })
      const data = await res.json()
      setReports(data)
    } catch (err) {
      console.error('Failed to fetch reports', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (id) => {
    if (!window.confirm('Mark this report as resolved?')) return
    try {
      const res = await fetch(`${API}/reports/${id}/resolve`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (res.ok) {
        setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r))
        if (selectedReport?._id === id) {
          setSelectedReport({ ...selectedReport, status: 'resolved' })
        }
      }
    } catch (err) {
      console.error('Failed to resolve report', err)
    }
  }

  const handleSuspend = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'active' ? 'suspend' : 'activate'} this trainer?`)) return
    try {
      const res = await fetch(`${API}/admin/users/${userId}/suspend`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (res.ok) {
        // Refresh reports to get updated user status
        fetchReports()
      }
    } catch (err) {
      console.error("Failed to suspend user", err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto relative overflow-hidden flex h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-[#F9FAFB]">
      <div className={`flex-1 overflow-y-auto space-y-6 pr-4 transition-all duration-300 ${selectedReport ? 'mr-96' : ''}`}>
        
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Trainer Reports</h1>
          <p className="text-gray-500 mt-1 font-medium">Review and resolve issues reported by clients.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="px-6 py-4">Reporter</th>
                  <th className="px-6 py-4">Trainer</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">Loading reports...</td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium flex flex-col items-center justify-center">
                      <ShieldAlert className="mb-2 text-gray-300" size={32} />
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedReport(report)}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-black">{report.reporter?.name}</div>
                        <div className="text-xs text-gray-500">{report.reporter?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-black">{report.reportedTrainer?.userId?.name}</div>
                        <div className="text-xs text-gray-500">{report.reportedTrainer?.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {report.reason}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setSelectedReport(report)} className="p-1.5 text-gray-400 hover:text-black transition-colors rounded hover:bg-gray-100">
                            <Eye size={16} />
                          </button>
                          {report.status === 'pending' && (
                            <button onClick={() => handleResolve(report._id)} className="p-1.5 text-green-600 hover:text-green-700 transition-colors rounded hover:bg-green-50" title="Resolve">
                              <Check size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side Panel for Report Details */}
      <div className={`fixed top-[4rem] right-0 h-[calc(100vh-4rem)] w-96 bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out z-40 flex flex-col ${selectedReport ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedReport && (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold font-['Syne'] text-black">Report Details</h2>
              <button onClick={() => setSelectedReport(null)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black hover:bg-gray-50 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                  selectedReport.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedReport.status}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Reporter (Client)</label>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="font-bold text-black">{selectedReport.reporter?.name}</div>
                  <div className="text-sm text-gray-500">{selectedReport.reporter?.email}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Reported Trainer</label>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div>
                    <div className="font-bold text-black">{selectedReport.reportedTrainer?.userId?.name}</div>
                    <div className="text-sm text-gray-500">{selectedReport.reportedTrainer?.userId?.email}</div>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        selectedReport.reportedTrainer?.userId?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        Account: {selectedReport.reportedTrainer?.userId?.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <a 
                      href={`/trainers/${selectedReport.reportedTrainer?._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 bg-white border border-gray-200 rounded text-center text-xs font-bold text-black hover:bg-gray-50 transition-colors"
                    >
                      View Profile
                    </a>
                    <button 
                      onClick={() => handleSuspend(selectedReport.reportedTrainer?.userId?._id, selectedReport.reportedTrainer?.userId?.status)}
                      className={`flex-1 py-1.5 rounded text-center text-xs font-bold transition-colors ${
                        selectedReport.reportedTrainer?.userId?.status === 'active' 
                          ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {selectedReport.reportedTrainer?.userId?.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Reason</label>
                <div className="text-black font-medium">{selectedReport.reason}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Detailed Explanation</label>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedReport.details}
                </div>
              </div>
            </div>

            {selectedReport.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button onClick={() => handleResolve(selectedReport._id)} className="w-full py-2.5 border border-green-200 bg-green-50 text-green-700 font-bold text-sm rounded-lg hover:bg-green-100 transition-colors">
                  Mark as Resolved
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}
