import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar({ isLoggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wider text-amber-500">LA BASE 228</Link>
        
        {/* DESKTOP MENU */}
        <div className="space-x-6 flex items-center hidden md:flex">
          <Link to="/chambres" className="hover:text-amber-400">Chambres</Link>
          <Link to="/services" className="hover:text-amber-400">Services</Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <motion.div 
          className="md:hidden mt-4 space-y-3 bg-slate-800 p-4 rounded"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Link to="/chambres" className="block hover:text-amber-400 py-2">Chambres</Link>
          <Link to="/services" className="block hover:text-amber-400 py-2">Services</Link>
         
        </motion.div>
      )}
    </nav>
  )
}