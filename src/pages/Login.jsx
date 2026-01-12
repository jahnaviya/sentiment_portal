import { Navigate } from 'react-router-dom'
import logo from '../assets/images/logo.jpeg'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/forms/LoginForm'

function Login() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img 
              src={logo} 
              alt="Sentimental Analytics" 
              className="mx-auto w-16 h-16 border-1 border-[#573361] rounded-full object-cover shadow-lg mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sentimental Analytics
            </h1>
            <p className="text-gray-600 text-sm">
              Political & News Sentiment Intelligence Platform
            </p>
          </div>

          <LoginForm />
          
          <p className="mt-6 text-center text-xs text-gray-500">
            copyright &copy; 2026 tekchant. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
