const API = 'https://hotel-project-8yex.onrender.com';

export const getToken = () => localStorage.getItem('token');

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getChambres() {
  const res = await fetch(`${API}/chambres`);
  return res.json();
}

export async function createChambre(chambre) {
  const res = await fetch(`${API}/chambres`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(chambre)
  });
  return res.json();
}

export async function deleteChambre(id) {
  const res = await fetch(`${API}/chambres/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function createReservation(reservation) {
  const res = await fetch(`${API}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation)
  });
  return res.json();
}

export async function getReservations() {
  const res = await fetch(`${API}/reservations`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function getServices() {
  const res = await fetch(`${API}/services`);
  return res.json();
}

export async function createService(service) {
  const res = await fetch(`${API}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(service)
  });
  return res.json();
}

export async function getDashboard() {
  const res = await fetch(`${API}/dashboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function deleteService(id) {
  const res = await fetch(`${API}/services/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}