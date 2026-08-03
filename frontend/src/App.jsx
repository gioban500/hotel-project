import { Outlet, Link, useNavigate } from 'react-router-dom'
import { getToken, logout } from './api'
import Navbar from './components/Navbar'

export default function App() {
  const navigate = useNavigate()
  const token = getToken()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} isLoggedIn={!!token} />
      <Outlet />
    </div>
  )
}