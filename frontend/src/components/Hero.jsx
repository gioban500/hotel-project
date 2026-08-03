import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section 
      className="relative bg-slate-800 text-white h-[70vh] flex items-center justify-center text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/44/76/6a/la-base-228.jpg?w=1400&h=800&s=1)',
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Votre confort, notre priorité à Lomé</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">Découvrez un cadre raffiné, des chambres élégantes et un service attentif au cœur d'Agoè-Assiyéyé.</p>
        <Link to="/chambres" className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-bold text-lg hover:bg-amber-400 transition inline-block">
          Découvrir nos suites
        </Link>
      </motion.div>
    </section>
  )
}