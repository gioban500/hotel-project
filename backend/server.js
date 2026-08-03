import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

let db;

async function initDB() {
  db = await open({
    filename: './hotel.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    );

    CREATE TABLE IF NOT EXISTS chambres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prix REAL NOT NULL,
      image TEXT,
      amenities TEXT,
      disponible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chambre_id INTEGER NOT NULL,
      nom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT NOT NULL,
      date_arrivee TEXT NOT NULL,
      date_depart TEXT NOT NULL,
      statut TEXT DEFAULT 'en_attente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      description TEXT,
      prix REAL,
      categorie TEXT,
      image TEXT
    );
  `);

  // Seed admin user
  const adminCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (adminCount.count === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
      ['admin@hotel.com', hashedPassword, 'admin']);
  }

  // Seed chambres
  const chambresCount = await db.get('SELECT COUNT(*) as count FROM chambres');
  if (chambresCount.count === 0) {
    await db.run(`INSERT INTO chambres VALUES (NULL, 'Chambre Double Standard', 45000, 'https://via.placeholder.com/300', 'Lit king-size, AC, WiFi, Écran plat', 1)`);
    await db.run(`INSERT INTO chambres VALUES (NULL, 'Studio Suite', 60000, 'https://via.placeholder.com/300', 'Salon, Kitchenette, Balcon', 1)`);
    await db.run(`INSERT INTO chambres VALUES (NULL, 'Suite de Luxe', 80000, 'https://via.placeholder.com/300', 'Grand salon, Jacuzzi, Vue panoramique', 1)`);
  }

  // Seed services
  const servicesCount = await db.get('SELECT COUNT(*) as count FROM services');
  if (servicesCount.count === 0) {
    await db.run(`INSERT INTO services VALUES (NULL, 'Cocktail Premium', 'Cocktails maison', 5000, 'bar', 'https://via.placeholder.com/300')`);
    await db.run(`INSERT INTO services VALUES (NULL, 'Soirée Karaoké', 'Karaoké tous les vendredis', 10000, 'entertainment', 'https://via.placeholder.com/300')`);
  }
}

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const user = await db.get('SELECT * FROM users WHERE email = ?', email);
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { email: user.email, role: user.role } });
});

// CHAMBRES ROUTES
app.get('/api/chambres', async (req, res) => {
  const chambres = await db.all('SELECT * FROM chambres WHERE disponible = 1');
  res.json(chambres);
});

app.post('/api/chambres', authMiddleware, async (req, res) => {
  const { id, nom, prix, image, amenities } = req.body;
  
  if (!nom || !prix) {
    return res.status(400).json({ error: 'Nom et prix requis' });
  }

  if (id) {
    await db.run('UPDATE chambres SET nom=?, prix=?, image=?, amenities=? WHERE id=?', 
      [nom, prix, image, amenities, id]);
  } else {
    await db.run('INSERT INTO chambres VALUES (NULL, ?, ?, ?, ?, 1)', 
      [nom, prix, image, amenities]);
  }
  res.json({ ok: true });
});

app.delete('/api/chambres/:id', authMiddleware, async (req, res) => {
  await db.run('DELETE FROM chambres WHERE id=?', req.params.id);
  res.json({ ok: true });
});

// RESERVATIONS ROUTES
app.post('/api/reservations', async (req, res) => {
  const { chambre_id, nom, email, telephone, date_arrivee, date_depart } = req.body;
  
  if (!chambre_id || !nom || !email || !telephone || !date_arrivee || !date_depart) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  if (new Date(date_depart) <= new Date(date_arrivee)) {
    return res.status(400).json({ error: 'Date de départ invalide' });
  }

  await db.run('INSERT INTO reservations VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
    [chambre_id, nom, email, telephone, date_arrivee, date_depart, 'en_attente']);
  
  res.json({ ok: true });
});

app.get('/api/reservations', authMiddleware, async (req, res) => {
  const reservations = await db.all('SELECT * FROM reservations ORDER BY created_at DESC');
  res.json(reservations);
});

// SERVICES ROUTES
app.get('/api/services', async (req, res) => {
  const services = await db.all('SELECT * FROM services');
  res.json(services);
});

app.post('/api/services', authMiddleware, async (req, res) => {
  const { id, nom, description, prix, categorie, image } = req.body;
  
  if (id) {
    await db.run('UPDATE services SET nom=?, description=?, prix=?, categorie=?, image=? WHERE id=?', 
      [nom, description, prix, categorie, image, id]);
  } else {
    await db.run('INSERT INTO services VALUES (NULL, ?, ?, ?, ?, ?)', 
      [nom, description, prix, categorie, image]);
  }
  res.json({ ok: true });
});

app.post('/api/services', authMiddleware, async (req, res) => {
  const { id, nom, description, prix, categorie, image } = req.body;
  
  if (!nom) {
    return res.status(400).json({ error: 'Nom requis' });
  }

  if (id) {
    await db.run('UPDATE services SET nom=?, description=?, prix=?, categorie=?, image=? WHERE id=?', 
      [nom, description, prix, categorie, image, id]);
  } else {
    await db.run('INSERT INTO services VALUES (NULL, ?, ?, ?, ?, ?)', 
      [nom, description, prix, categorie, image]);
  }
  res.json({ ok: true });
});

// DELETE service
app.delete('/api/services/:id', authMiddleware, async (req, res) => {
  await db.run('DELETE FROM services WHERE id=?', req.params.id);
  res.json({ ok: true });
});

// DASHBOARD (admin only)
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  const totalReservations = await db.get('SELECT COUNT(*) as count FROM reservations');
  const totalRevenue = await db.get('SELECT SUM((SELECT prix FROM chambres WHERE id = reservations.chambre_id)) as total FROM reservations');
  const recentReservations = await db.all('SELECT * FROM reservations ORDER BY created_at DESC LIMIT 5');
  
  res.json({
    totalReservations: totalReservations.count,
    totalRevenue: totalRevenue.total || 0,
    recentReservations
  });
});

app.patch('/api/reservations/:id', authMiddleware, async (req, res) => {
  const { statut } = req.body;
  if (!statut) return res.status(400).json({ error: 'Statut requis' });
  
  await db.run('UPDATE reservations SET statut = ? WHERE id = ?', [statut, req.params.id]);
  res.json({ ok: true });
});

initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Backend sur http://localhost:${process.env.PORT}`);
  });
});