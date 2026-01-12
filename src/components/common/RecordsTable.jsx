import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import EditRecordModal from '../forms/EditRecordModal'

// Utility: returns YYYY-MM-DD HH:mm when time present
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    // If it's a date-only string like '2026-01-12', return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch (err) {
    return dateString
  }
}

// Utility: always return date-only YYYY-MM-DD (strip time if present)
const formatDateDateOnly = (dateString) => {
  if (!dateString) return ''
  try {
    // If already date-only
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch (err) {
    // Fallback: try to extract date portion
    return String(dateString).split('T')[0] || dateString
  }
} 

function RecordsTable({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null)

  const closeModal = () => setSelectedRecord(null)
  const [editingRecord, setEditingRecord] = useState(null)

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'Positive': return 'text-green-700 bg-green-50 border-green-200'
      case 'Negative': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  if (!records || records.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-600">No records found</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Records</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Topic</th>
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Type</th>
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Sentiment</th>
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Confidence</th>
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Party</th>
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Date</th>
              <th className="text-left text-xs font-medium text-gray-600 uppercase tracking-wide pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.analytics_id || record.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 pr-4">
                  <div className="font-medium text-sm text-gray-900">{record.topic}</div>
                  <div className="text-xs text-gray-600">{record.impacted_area || record.area}</div>
                </td>
                <td className="py-4 pr-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">{record.type}</span>
                </td>
                <td className="py-4 pr-4">
                  <span className={`text-xs px-2 py-1 border rounded-md ${getSentimentColor(record.sentiment)}`}>
                    {record.sentiment}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#573361]"
                        style={{ width: `${(record.confidence || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{((record.confidence || 0) * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-900">{record.party_name || record.party}</td>
                <td className="py-4 text-xs text-gray-600">{formatDateDateOnly(record.sentiment_date || record.date)}</td>
                <td className="py-4 pr-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record details modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div role="dialog" aria-modal="true" className="relative bg-white border border-gray-300 rounded-lg shadow max-w-full sm:max-w-2xl md:max-w-3xl w-full mx-4 p-4 z-10 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Record Details</h3>
                <p className="text-xs text-gray-500">{selectedRecord.topic} • {selectedRecord.sentiment} • {formatDate(selectedRecord.sentiment_date || selectedRecord.date)}</p>
              </div>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Topic</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.topic}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.type}</div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900 min-h-[40px]">{selectedRecord.description || '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sentiment</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.sentiment}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Confidence</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{((selectedRecord.confidence || 0) * 100).toFixed(0)}%</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Source URL</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.source_url ? <a className="text-blue-600 underline" href={selectedRecord.source_url} target="_blank" rel="noreferrer">Open</a> : '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sentiment Date</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{formatDateDateOnly(selectedRecord.sentiment_date || selectedRecord.date)}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.state_name || '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assembly</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.assembly_name || '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Party</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.party_name || '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Impacted Area</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.impacted_area || '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Region/State</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.region_state || '-'}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Influence Score</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900">{selectedRecord.influence_score ?? '-'}</div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Keywords</label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900 truncate">{selectedRecord.keywords || '-'}</div>
                </div>
              </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
              <button onClick={closeModal} className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
              <button onClick={() => { setSelectedRecord(null); setEditingRecord(selectedRecord); }} className="px-4 py-2 text-sm bg-[#573361] hover:bg-[#553365] text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSaved={() => setEditingRecord(null)}
        />
      )}
    </div>
  )
}

export default RecordsTable