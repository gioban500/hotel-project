import { useState, useEffect } from 'react'
import { getServices } from '../api'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices().then(data => {
      setServices(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-8">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Nos Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-lg p-6">
            <img src={service.image} alt={service.nom} className="w-full h-48 object-cover rounded mb-4" />
            <h3 className="text-xl font-bold mb-2">{service.nom}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-amber-600 font-bold text-lg">{service.prix?.toLocaleString()} FCFA</p>
          </div>
        ))}
      </div>
    </div>
  )
}