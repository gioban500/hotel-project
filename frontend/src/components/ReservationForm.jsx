import { useState, useEffect } from 'react'
import { createReservation } from '../api'

export default function ReservationForm({ chambres, selectedRoomId }) {
  const [form, setForm] = useState({
    chambre_id: selectedRoomId || '',
    nom: '',
    email: '',
    telephone: '',
    date_arrivee: '',
    date_depart: ''
  })
  const [message, setMessage] = useState('')
  const [addAnother, setAddAnother] = useState(false)
  

  useEffect(() => {
    setForm(prev => ({ ...prev, chambre_id: selectedRoomId || '' }))
  }, [selectedRoomId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.chambre_id || !form.nom || !form.email || !form.telephone || !form.date_arrivee || !form.date_depart) {
      setMessage('❌ Tous les champs sont requis')
      return
    }

    if (new Date(form.date_depart) <= new Date(form.date_arrivee)) {
      setMessage('❌ Date de départ invalide')
      return
    }

    const res = await createReservation(form)
    if (res.ok) {
      setMessage('✅ Réservation confirmée! Vous pouvez en ajouter une autre.')
      if (!addAnother) {
        setForm({ chambre_id: '', nom: '', email: '', telephone: '', date_arrivee: '', date_depart: '' })
      } else {
        setForm({ ...form, chambre_id: '', date_arrivee: '', date_depart: '' })
      }
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage('❌ Erreur')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4 max-w-2xl mx-auto">
      {message && <div className="p-4 bg-gray-100 rounded text-center font-semibold">{message}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nom Complet</label>
          <input type="text" name="nom" value={form.nom} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Téléphone</label>
          <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+228..." className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Chambre</label>
          <select name="chambre_id" value={form.chambre_id} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded" required>
            <option value="">Choisir...</option>
            {chambres.map(c => (
              <option key={c.id} value={c.id}>{c.nom} - {c.prix.toLocaleString()} FCFA</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Arrivée</label>
          <input type="date" name="date_arrivee" value={form.date_arrivee} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Départ</label>
          <input type="date" name="date_depart" value={form.date_depart} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="addAnother" checked={addAnother} onChange={(e) => setAddAnother(e.target.checked)} />
        <label htmlFor="addAnother" className="text-sm">Ajouter une autre réservation</label>
      </div>

      <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition">
        Envoyer ma demande
      </button>
    </form>
  )
}