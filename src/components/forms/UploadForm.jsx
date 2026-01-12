import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const initialFormState = {
  topic: '',
  topicCustom: '',
  type: 'News',
  description: '',
  sentiment: 'Neutral',
  confidence: '',
  sourceUrl: '',
  date: '',
  assembly: '',
  party: '',
  area: '',
  region: '',
  influenceScore: '',
  keywords: '',
}

import uploadAnalyticsRecord, { fetchMasterData } from '../../apis/UploadAnalyticsApis'

function UploadForm({ onSubmit }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [masterLoading, setMasterLoading] = useState(true)
  const [parties, setParties] = useState([])
  const [statesList, setStatesList] = useState([])
  const [assemblies, setAssemblies] = useState([])
  const [topics, setTopics] = useState([])
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false)

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

  // clear assembly selection when state changes
  useEffect(() => {
    setForm(prev => ({ ...prev, assembly: '' }))
  }, [form.state])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (!form.topic || !String(form.topic).trim()) return 'Topic is required.'
    if (!form.sentiment) return 'Sentiment is required.'
    if (form.confidence !== '' && (isNaN(Number(form.confidence)) || Number(form.confidence) < 0 || Number(form.confidence) > 1)) return 'Confidence must be a number between 0 and 1.'
    if (form.influenceScore !== '' && (isNaN(Number(form.influenceScore)) || Number(form.influenceScore) < 1 || Number(form.influenceScore) > 10)) return 'Influence Score must be between 1 and 10.'
    if (form.date && !/^\d{4}-\d{2}-\d{2}$/.test(form.date)) return 'Date must be in YYYY-MM-DD format.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    const validationError = validateForm()
    if (validationError) {
      setMessage({ type: 'error', text: validationError })
      setSubmitting(false)
      return
    }

    try {
      // Build backend payload mapping our form field names to stored proc input names
      const userRaw = sessionStorage.getItem('user')
      const userObj = userRaw ? JSON.parse(userRaw) : null
      const user_id = userObj?.id || null

// Determine topic value (support "Other" custom topic)
    const topicVal = (topics.length > 0) ? (form.topic === '__other__' ? (form.topicCustom || '') : form.topic) : form.topic

    const payload = {
      user_id,
      topic: topicVal,
        type: form.type,
        description: form.description,
        sentiment: form.sentiment,
        confidence: Number(form.confidence) || 0,
        source_url: form.sourceUrl || '',
        sentiment_date: form.date || null,
        state_name: form.state || '',
        assembly_name: form.assembly || '',
        party_name: form.party || '',
        impacted_area: form.area || '',
        region_state: form.region || '',
        influence_score: form.influenceScore ? Number(form.influenceScore) : null,
        keywords: form.keywords || '',
        stage: 'dev',
      }

      if (!payload.user_id) {
        setMessage({ type: 'error', text: 'You must be logged in to upload records.' })
        setSubmitting(false)
        return
      }

      const result = await uploadAnalyticsRecord(payload)

      // Handle RESULT array or direct flags
      const entry = (result && Array.isArray(result.RESULT) && result.RESULT.length > 0) ? result.RESULT[0] : result
      const flag = entry?.status || entry?.p_out_mssg_flg || (result?.p_out_mssg_flg) || (entry?.success ? 'S' : 'F')
      const success = flag && String(flag).toUpperCase() === 'S' || result?.success === true || entry?.success === true

      if (!success) {
        const err = entry?.message || result?.p_out_mssg || result?.message || 'Upload failed'
        setMessage({ type: 'error', text: err })
      } else {
        const ok = entry?.message || result?.p_out_mssg || 'Record uploaded successfully'
        setMessage({ type: 'success', text: ok })
        setForm(initialFormState)

        if (onSubmit) onSubmit(result)

        // Dispatch events: navigate to overview and refresh records, then navigate to dashboard route
        window.dispatchEvent(new Event('navigate:overview'))
        window.dispatchEvent(new Event('records:refresh'))
        setTimeout(() => {
          navigate('/dashboard')
        }, 700)
      }
    } catch (err) {
      const errTxt = err?.response?.data?.message || err.message || 'Network error'
      setMessage({ type: 'error', text: errTxt })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(initialFormState)
  }

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#573361] focus:border-transparent transition"

  return (
    <div className="space-y-4">
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Topic *</label>
          <div className="relative">
            <input
              name="topic"
              value={form.topic}
              onChange={handleChange}
              onFocus={() => setShowTopicSuggestions(true)}
              onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 150)}
              className={inputClass}
              placeholder={topics.length ? 'Type to search or enter topic' : 'Type topic'}
              required
              aria-autocomplete="list"
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
          <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            <option>News</option>
            <option>Tweet</option>
            <option>Text</option>
            <option>Speech</option>
            <option>Press Release</option>
            <option>Others</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Brief description of the sentiment content..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sentiment *</label>
          <select name="sentiment" value={form.sentiment} onChange={handleChange} className={inputClass}>
            <option>Positive</option>
            <option>Negative</option>
            <option>Neutral</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Confidence (0-1)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            name="confidence"
            value={form.confidence}
            onChange={handleChange}
            className={inputClass}
            placeholder="0.85"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Source URL</label>
          <input
            type="url"
            name="sourceUrl"
            value={form.sourceUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://example.com/article"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className={inputClass}
            disabled={masterLoading || statesList.length === 0}
          >
            <option value="">{masterLoading ? 'Loading states...' : 'Select state'}</option>
            {statesList.map(s => (
              <option key={s.state_id} value={s.state_name}>{s.state_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Assembly</label>
          <select
            name="assembly"
            value={form.assembly}
            onChange={handleChange}
            className={inputClass}
            disabled={masterLoading || assemblies.length === 0 || !form.state}
          >
            <option value="">{masterLoading ? 'Loading assemblies...' : (!form.state ? 'Select state first' : 'Select assembly')}</option>
            {assemblies
              .filter(a => !form.state || a.state_name === form.state)
              .map(a => (
                <option key={a.assembly_id} value={a.assembly_name}>{a.assembly_name}</option>
              ))}
          </select>
        </div> 

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Party</label>
          <select
            name="party"
            value={form.party}
            onChange={handleChange}
            className={inputClass}
            disabled={masterLoading || parties.length === 0}
          >
            <option value="">{masterLoading ? 'Loading parties...' : 'Select party'}</option>
            {parties.map(p => (
              <option key={p.party_id} value={p.party_name}>{p.party_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Impacted Area</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g., Healthcare, Economy"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Region/State</label>
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g., Maharashtra, Delhi"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Influence Score (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            name="influenceScore"
            value={form.influenceScore}
            onChange={handleChange}
            className={inputClass}
            placeholder="7"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
          <input
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            className={inputClass}
            placeholder="reform, policy, development"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-[#573361] hover:bg-[#553365] text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
        >
          Save Sentiment
        </button>
      </div>
    </div>
  )
}

export default UploadForm