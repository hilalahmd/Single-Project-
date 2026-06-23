export default function Table({ columns = [], rows = [], data = [], onRowClick }) {
  // Support both `rows` and `data` prop names for compatibility
  const tableData = rows.length > 0 ? rows : data

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-['Inter']">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-[0.6rem] font-[800] text-gray-500 uppercase tracking-[0.2em] font-['Syne']"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-600 text-sm">
                  No data found
                </td>
              </tr>
            ) : (
              tableData.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-gray-300">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
