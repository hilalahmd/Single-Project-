import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, Search, Filter } from 'lucide-react'
import API from '../../../shared/utils/api'
import GlobalLoader from '../../../shared/components/GlobalLoader'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API}/admin/audit-logs`, { credentials: 'include' })
        const data = await res.json()
        setLogs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch audit logs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => {
    const performedByName = log.performedBy?.name?.toLowerCase() || ''
    const targetName = log.targetUser?.name?.toLowerCase() || ''
    const details = log.details?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()
    return performedByName.includes(query) || targetName.includes(query) || details.includes(query)
  })

  if (isLoading) return <GlobalLoader />

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight font-['Syne']">Audit Logs</h1>
          <p className="text-gray-500 font-medium mt-1">Track administrative actions and system events</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm font-medium"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Performed By</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action Type</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Target User</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No logs found.
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-black">{new Date(log.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-black">{log.performedBy?.name || 'System'}</p>
                    <p className="text-xs text-gray-500">{log.performedBy?.role || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-black text-[10px] font-black uppercase tracking-widest rounded-md">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.targetUser ? (
                      <>
                        <p className="font-bold text-black">{log.targetUser.name}</p>
                        <p className="text-xs text-gray-500">{log.targetUser.role}</p>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
