import EmptyState from './EmptyState'
import { Inbox } from 'lucide-react'

export default function Table({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available"
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th 
                key={col.key || i} 
                className="bg-[#F5F4F0] text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 whitespace-nowrap first:rounded-tl-xl last:rounded-tr-xl border-b border-[#E5E4E0]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#E5E4E0] last:border-0">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4">
                    <div className="h-4 bg-[#F5F4F0] rounded animate-pulse w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 border-b border-[#E5E4E0]">
                <EmptyState 
                  icon={Inbox}
                  title="No records found"
                  description={emptyMessage}
                />
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className="border-b border-[#E5E4E0] hover:bg-[#F5F4F0]/50 transition-colors last:border-0"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-[#1A1A1A] font-medium whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
