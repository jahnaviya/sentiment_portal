import { Menu } from 'lucide-react'

function Header({ activeTab, setSidebarOpen, user }) {
  const getTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Dashboard Overview'
      case 'upload': return 'Upload Sentiment'
      case 'analytics': return 'Analytics'
      case 'settings': return 'Settings'
      default: return 'Dashboard'
    }
  }

  const getSubtitle = () => {
    switch(activeTab) {
      case 'overview': return 'Real-time sentiment intelligence'
      case 'upload': return 'Add new sentiment records'
      case 'analytics': return 'Visualize trends and patterns'
      case 'settings': return 'Configure your preferences'
      default: return ''
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>
          <p className="text-xs text-gray-600">{getSubtitle()}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
          <span>Logged in as</span>
          <span className="text-gray-900 font-medium">{user?.name || user?.email || 'User'}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#573361] flex items-center justify-center text-sm font-semibold text-white">
          {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
        </div>
      </div>
    </header>
  )
}

export default Header