import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import RoomGrid from '../components/RoomGrid'
import ReservationForm from '../components/ReservationForm'
import { getChambres, getServices } from '../api'
import { motion } from 'framer-motion'

export default function Home() {
  const [chambres, setChambres] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const reservationRef = useRef(null)

  useEffect(() => {
  const roomId = localStorage.getItem('selectedRoomId')
  if (roomId) {
    setSelectedRoomId(parseInt(roomId))
    localStorage.removeItem('selectedRoomId')
  }
}, [])

  useEffect(() => {
    Promise.all([getChambres(), getServices()]).then(([c, s]) => {
      setChambres(c)
      setServices(s)
      setLoading(false)
    })
  }, [])

  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId)
    setTimeout(() => {
      reservationRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  if (loading) return <div className="text-center py-8">Chargement...</div>

  return (
    <div>
      <Hero />
      
      {/* CHAMBRES */}
<section className="py-16 max-w-6xl mx-auto px-4">
  <div className="flex justify-between items-center mb-12">
    <h3 className="text-3xl font-bold">Nos Chambres & Suites</h3>
    <Link to="/chambres" className="text-amber-600 hover:underline font-semibold">Voir toutes →</Link>
  </div>
  <RoomGrid chambres={chambres.slice(0, 3)} onSelectRoom={handleSelectRoom} />
</section>

      {/* SERVICES */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold">Pizzeria & Services</h3>
            <Link to="/services" className="text-amber-400 hover:underline font-semibold">Voir tous →</Link>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.slice(0, 3).map(s => (
              <motion.div 
                key={s.id} 
                className="bg-slate-800 p-6 rounded hover:bg-slate-700 transition"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <h4 className="font-bold text-lg mb-2">{s.nom}</h4>
                <p className="text-gray-300 text-sm mb-4">{s.description}</p>
                <p className="text-amber-500 font-bold">{s.prix?.toLocaleString()} FCFA</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* RESERVATION */}
      <section id="reservation" ref={reservationRef} className="py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-8">Demande de Réservation</h3>
        <ReservationForm chambres={chambres} selectedRoomId={selectedRoomId} />
      </section>

       {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-400 py-12 text-center text-sm border-t border-slate-800">
  <div className="max-w-6xl mx-auto px-4">
    
    {/* Section Réservation Personnalisée */}
    <div className="bg-slate-850 border border-slate-800 rounded-lg p-6 mb-10 max-w-2xl mx-auto">
      <h3 className="text-white text-base font-semibold mb-2"> Une demande particulière ou un événement ?</h3>
      <p className="text-gray-400 mb-4">Pour toute réservation personnalisée (groupes, séjours de longue durée, formules spéciales), notre équipe est à votre écoute.</p>
      <a 
        href="https://wa.me/22898795276?text=Bonjour%20je%20souhaite%20en%20savoir%20plus%20pour%20une%20r%C3%A9servation%20sur%20mesure" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded font-medium inline-block transition-colors"
      >
        💬 Contactez-nous pour une offre sur-mesure
      </a>
    </div>

    {/* Grille d'informations classiques */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-t border-slate-850 pt-8">
      <div>
        <h4 className="text-white font-bold mb-2"> Adresse</h4>
        <p>Agoè-Assiyéyé, Route Camp FIR<br/>Lomé, Togo</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-2"> Contact</h4>
        <p>+228 93 22 29 29<br/>+228 22 51 28 28</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-2"> Info</h4>
        <p>Ouvert 24h/24 & 7j/7<br/>Lomé, Togo</p>
      </div>
    </div>
    
    <p className="border-t border-slate-700 pt-6">&copy; 2026 Hôtel La Base 228 - Agoè-Assiyéyé, Lomé, Togo.</p>
  </div>
</footer>
    </div>
  )
}