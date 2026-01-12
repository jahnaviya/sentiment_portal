import { useState, useEffect, useMemo } from 'react'
import { BarChart3, TrendingUp, PieChart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import fetchAnalyticsRecords from '../apis/DashboardApis'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import StatsCard from '../components/common/StatsCard'
import RecordsTable from '../components/common/RecordsTable'
import UploadForm from '../components/forms/UploadForm'

function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Calculate stats dynamically from records
  const calculatedStats = useMemo(() => {
    const total = records.length
    const positive = records.filter(r => r.sentiment === 'Positive').length
    const negative = records.filter(r => r.sentiment === 'Negative').length
    const neutral = records.filter(r => r.sentiment === 'Neutral').length

    return [
      { label: 'Total Records', value: total, color: 'from-blue-500 to-cyan-500' },
      { label: 'Positive', value: positive, color: 'from-emerald-500 to-teal-500' },
      { label: 'Negative', value: negative, color: 'from-rose-500 to-pink-500' },
      { label: 'Neutral', value: neutral, color: 'from-amber-500 to-orange-500' },
    ]
  }, [records])

  const statsIcons = {
    'Total Records': BarChart3,
    'Positive': TrendingUp,
    'Negative': TrendingUp,
    'Neutral': PieChart,
  }

  // Load function to fetch analytics records
  const loadRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const result = await fetchAnalyticsRecords({ user_id: user.id, stage: 'dev' })

      // Handle response with RESULT array
      // The stored proc returns a message, status and then a result set (array of row objects)
      const flagEntry = (result && Array.isArray(result.STATUS) && result.STATUS.length > 0) ? result.STATUS[0] : null
      const statusFlag = flagEntry?.status || result?.status || result?.p_out_mssg_flg
      const success = statusFlag && String(statusFlag).toUpperCase() === 'S'

      if (!success) {
        setError(flagEntry?.message || result?.p_out_mssg || result?.message || 'Failed to load records')
        setRecords([])
      } else {
        // If response contains RESULT and it's an array of records, use it; otherwise detect direct array
        const recordsData = Array.isArray(result) ? result : (Array.isArray(result.RESULT) ? result.RESULT : [])
        setRecords(recordsData)
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Network error')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch when user logs in or when the overview tab becomes active
  useEffect(() => {
    if (user?.id && activeTab === 'overview') {
      loadRecords()
    }
  }, [user?.id, activeTab])

  // Listen for manual refresh events (dispatched by Sidebar clicks or Upload success)
  useEffect(() => {
    const handler = () => {
      if (activeTab === 'overview') loadRecords()
    }
    window.addEventListener('records:refresh', handler)
    return () => window.removeEventListener('records:refresh', handler)
  }, [activeTab, user?.id])

  // Listen for navigation requests to Overview and switch tab (UploadForm dispatches this)
  useEffect(() => {
    const navHandler = () => {
      setActiveTab('overview')
    }
    window.addEventListener('navigate:overview', navHandler)
    return () => window.removeEventListener('navigate:overview', navHandler)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="lg:ml-64">
        <Header 
          activeTab={activeTab} 
          setSidebarOpen={setSidebarOpen}
          user={user}
        />

        <main className="p-4 lg:p-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {calculatedStats.map((stat, i) => (
                  <StatsCard 
                    key={i} 
                    stat={stat} 
                    Icon={statsIcons[stat.label]} 
                  />
                ))}
              </div>

              {/* Recent Records Table */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                  <p className="text-gray-600">Loading records...</p>
                </div>
              ) : (
                <RecordsTable records={records} />
              )}
            </>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Sentiment Record</h2>
                <UploadForm />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
              <PieChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Charts and visualizations coming soon</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto text-gray-400 mb-4 flex items-center justify-center">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">Configuration options coming soon</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard