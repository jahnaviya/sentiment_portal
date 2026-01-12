import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import updateAnalyticsRecord from '../../apis/UpdateAnalyticsApis'
import { fetchMasterData } from '../../apis/UploadAnalyticsApis'

const inputClass = "w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#573361] focus:border-transparent transition"

export default function EditRecordModal({ record, onClose, onSaved }) {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [masterLoading, setMasterLoading] = useState(true)
  const [parties, setParties] = useState([])
  const [statesList, setStatesList] = useState([])
  const [assemblies, setAssemblies] = useState([])
  const [topics, setTopics] = useState([])
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false)

  // Normalize date values to YYYY-MM-DD for <input type="date"> compatibility
  const formatForDateInput = (dateString) => {
    if (!dateString) return ''
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString
      const d = new Date(dateString)
      if (isNaN(d)) return String(dateString).split('T')[0] || ''
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (err) {
      return String(dateString).split('T')[0] || ''
    }
  }

  useEffect(() => {
    setForm({
      topic: record.topic || '',
      topicCustom: '',
      type: record.type || 'News',
      description: record.description || '',
      sentiment: record.sentiment || 'Neutral',
      confidence: record.confidence != null ? String(record.confidence) : '',
      source_url: record.source_url || '',
      sentiment_date: formatForDateInput(record.sentiment_date || record.date || ''),
      state_name: record.state_name || '',
      assembly_name: record.assembly_name || '',
      party_name: record.party_name || '',
      impacted_area: record.impacted_area || '',
      region_state: record.region_state || '',
      influence_score: record.influence_score != null ? String(record.influence_score) : '',
      keywords: record.keywords || '',
    })
  }, [record])

  useEffect(() => {
    const loadMaster = async () => {
      setMasterLoading(true)
      try {
        const userRaw = sessionStorage.getItem('user')
        const userObj = userRaw ? JSON.parse(userRaw) : null
        const user_id = userObj?.id || null
        if (!user_id) {
          setMasterLoading(false)
          return
        }
        const res = await fetchMasterData({ user_id, stage: 'dev' })
        const resObj = res?.RESULT || {}
        setParties(resObj.PARTY || [])
        setStatesList(resObj.STATE || [])
        setAssemblies(resObj.ASSEMBLY || [])
        setTopics(resObj.TOPIC || [])
      } catch (err) {
        setMessage({ type: 'error', text: err?.response?.data?.message || err.message || 'Failed to load master data' })
      } finally {
        setMasterLoading(false)
      }
    }

    loadMaster()
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateForm = () => {
    if (!form.topic || !String(form.topic).trim()) return 'Topic is required.'
    if (!form.sentiment) return 'Sentiment is required.'
    if (form.confidence !== '' && (isNaN(Number(form.confidence)) || Number(form.confidence) < 0 || Number(form.confidence) > 1)) return 'Confidence must be a number between 0 and 1.'
    if (form.influence_score !== '' && (isNaN(Number(form.influence_score)) || Number(form.influence_score) < 1 || Number(form.influence_score) > 10)) return 'Influence Score must be between 1 and 10.'
    if (form.sentiment_date && !/^\d{4}-\d{2}-\d{2}$/.test(form.sentiment_date)) return 'Date must be in YYYY-MM-DD format.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    const validationError = validateForm()
    if (validationError) {
      setMessage({ type: 'error', text: validationError })
      setLoading(false)
      return
    }
    try {
      const userRaw = sessionStorage.getItem('user')
      const userObj = userRaw ? JSON.parse(userRaw) : null
      const user_id = userObj?.id || null
      if (!user_id) {
        setMessage({ type: 'error', text: 'You must be logged in to update records.' })
        setLoading(false)
        return
      }

      const topicVal = (topics.length > 0) ? (form.topic === '__other__' ? (form.topicCustom || '') : form.topic) : form.topic

      const payload = {
        user_id,
        analytics_id: record.analytics_id || record.id,
        topic: topicVal,
        type: form.type,
        description: form.description,
        sentiment: form.sentiment,
        confidence: form.confidence !== '' ? Number(form.confidence) : null,
        source_url: form.source_url || '',
        sentiment_date: form.sentiment_date || null,
        state_name: form.state_name || '',
        assembly_name: form.assembly_name || '',
        party_name: form.party_name || '',
        impacted_area: form.impacted_area || '',
        region_state: form.region_state || '',
        influence_score: form.influence_score !== '' ? Number(form.influence_score) : null,
        keywords: form.keywords || '',
        stage: 'dev',
      }

      const res = await updateAnalyticsRecord(payload)
      const entry = (res && Array.isArray(res.RESULT) && res.RESULT.length > 0) ? res.RESULT[0] : res
      const flag = entry?.status || entry?.p_out_mssg_flg || (res?.p_out_mssg_flg) || (entry?.success ? 'S' : 'F')
      const success = flag && String(flag).toUpperCase() === 'S' || res?.success === true || entry?.success === true

      if (!success) {
        const err = entry?.message || res?.p_out_mssg || res?.message || 'Update failed'
        setMessage({ type: 'error', text: err })
      } else {
        const ok = entry?.message || res?.p_out_mssg || 'Record updated successfully'
        setMessage({ type: 'success', text: ok })
        // Refresh list and notify parent
        window.dispatchEvent(new Event('records:refresh'))
        if (onSaved) onSaved()
        setTimeout(() => {
          onClose()
        }, 700)
      }
    } catch (err) {
      const errTxt = err?.response?.data?.message || err.message || 'Network error'
      setMessage({ type: 'error', text: errTxt })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({
      topic: record.topic || '',
      type: record.type || 'News',
      description: record.description || '',
      sentiment: record.sentiment || 'Neutral',
      confidence: record.confidence != null ? String(record.confidence) : '',
      source_url: record.source_url || '',
      sentiment_date: record.sentiment_date || record.date || '',
      state_name: record.state_name || '',
      assembly_name: record.assembly_name || '',
      party_name: record.party_name || '',
      impacted_area: record.impacted_area || '',
      region_state: record.region_state || '',
      influence_score: record.influence_score != null ? String(record.influence_score) : '',
      keywords: record.keywords || '',
    })
    setMessage(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white border border-gray-300 rounded-lg shadow max-w-full sm:max-w-2xl md:max-w-3xl w-full mx-4 p-4 z-10 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Edit Record</h3>
            <p className="text-xs text-gray-500">Make changes and click Save</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {message && (
          <div className={`px-3 py-2 rounded text-sm ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Topic</label>
            <div className="relative">
              <input
                name="topic"
                value={form.topic}
                onChange={handleChange}
                onFocus={() => setShowTopicSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 150)}
                className={inputClass}
                placeholder={topics.length ? 'Type to search or enter topic' : 'Type topic'}
                autoComplete="off"
              />

              {showTopicSuggestions && topics.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-auto">
                  {topics.filter(t => t.topic.toLowerCase().includes((form.topic || '').toLowerCase())).slice(0, 10).map((t, i) => (
                    <li key={i} onMouseDown={() => { setForm(prev => ({ ...prev, topic: t.topic })); setShowTopicSuggestions(false); }} className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm">{t.topic}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option>News</option>
              <option>Tweet</option>
              <option>Text</option>
              <option>Speech</option>
              <option>Press Release</option>
              <option>Others</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sentiment</label>
            <select name="sentiment" value={form.sentiment} onChange={handleChange} className={inputClass}>
              <option>Positive</option>
              <option>Negative</option>
              <option>Neutral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Confidence</label>
            <input type="number" step="0.01" min="0" max="1" name="confidence" value={form.confidence} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Source URL</label>
            <input name="source_url" value={form.source_url} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sentiment Date</label>
            <input type="date" name="sentiment_date" value={form.sentiment_date} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
            <select name="state_name" value={form.state_name} onChange={handleChange} className={inputClass} disabled={masterLoading || statesList.length === 0}>
              <option value="">{masterLoading ? 'Loading...' : 'Select state'}</option>
              {statesList.map(s => <option key={s.state_id} value={s.state_name}>{s.state_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Assembly</label>
            <select name="assembly_name" value={form.assembly_name} onChange={handleChange} className={inputClass} disabled={masterLoading || assemblies.length === 0 || !form.state_name}>
              <option value="">{masterLoading ? 'Loading...' : (!form.state_name ? 'Select state first' : 'Select assembly')}</option>
              {assemblies.filter(a => !form.state_name || a.state_name === form.state_name).map(a => <option key={a.assembly_id} value={a.assembly_name}>{a.assembly_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Party</label>
            <select name="party_name" value={form.party_name} onChange={handleChange} className={inputClass} disabled={masterLoading || parties.length === 0}>
              <option value="">{masterLoading ? 'Loading...' : 'Select party'}</option>
              {parties.map(p => <option key={p.party_id} value={p.party_name}>{p.party_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Impacted Area</label>
            <input name="impacted_area" value={form.impacted_area} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Region/State</label>
            <input name="region_state" value={form.region_state} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Influence Score</label>
            <input type="number" min="1" max="10" name="influence_score" value={form.influence_score} onChange={handleChange} className={inputClass} />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Keywords</label>
            <input name="keywords" value={form.keywords} onChange={handleChange} className={inputClass} />
          </div>

        </div>

        <div className="mt-3 flex flex-col sm:flex-row justify-end gap-2">
          <button type="button" onClick={handleReset} className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Reset</button>
          <button type="button" onClick={onClose} className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-3 py-1 text-sm bg-[#573361] hover:bg-[#553365] text-white rounded-lg">{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
