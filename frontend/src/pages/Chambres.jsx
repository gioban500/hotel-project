import { useState, useEffect } from 'react'
import RoomGrid from '../components/RoomGrid'
import { getChambres } from '../api'

export default function Chambres() {
  const [chambres, setChambres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChambres().then(data => {
      setChambres(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-8">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Toutes nos Chambres</h1>
      <RoomGrid chambres={chambres} />
    </div>
  )
}