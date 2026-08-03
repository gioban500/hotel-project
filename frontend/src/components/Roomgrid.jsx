import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function RoomGrid({ chambres, onSelectRoom }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }
  
  const [selectedRoomId, setSelectedRoomId] = useState(null)

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {chambres.map(chambre => (
        <motion.div 
          key={chambre.id} 
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <img src={chambre.image} alt={chambre.nom} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h4 className="font-bold text-xl mb-2">{chambre.nom}</h4>
            <p className="text-gray-600 text-sm mb-4">{chambre.amenities}</p>
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>{chambre.prix.toLocaleString()} F CFA</span>
              <Link 
                to="/#reservation" 
                onClick={() => onSelectRoom && onSelectRoom(chambre.id)}
                className="bg-amber-500 text-slate-900 px-4 py-2 rounded hover:bg-amber-400 text-sm font-semibold"
              >
                Réserver
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}