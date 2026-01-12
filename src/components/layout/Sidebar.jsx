import { BarChart3, PieChart, Upload, Settings, LogOut, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.jpeg'  // Adjust path if Sidebar is in src/components/ (e.g., '../../../assets...')
import { useAuth } from '../../context/AuthContext'

function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'upload', label: 'Upload Sentiment', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Sentimental Analytics" 
            className="w-11 h-11 border-1 border-[#573361] rounded-full object-cover"
          />
          <span className="font-semibold text-gray-900">SentimentalAnalytics</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-600 hover:text-gray-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => {
                // If clicking the already active tab, dispatch a refresh event so the page reloads data
                if (activeTab === item.id) {
                  window.dispatchEvent(new Event('records:refresh'))
                }

                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === item.id
                  ? 'bg-[#573361] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
