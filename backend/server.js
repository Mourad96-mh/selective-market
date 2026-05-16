require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Admin = require('./models/Admin')

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('CORS non autorisé'))
  },
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/brands', require('./routes/brands'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/upload', require('./routes/upload'))
app.use('/sitemap.xml', require('./routes/sitemap'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connecté')

    const exists = await Admin.findOne()
    if (!exists) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
      console.log(`Admin créé : ${process.env.ADMIN_EMAIL}`)
    }

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Serveur : http://localhost:${PORT}`))
  } catch (err) {
    console.error('Erreur démarrage :', err)
    process.exit(1)
  }
}

start()
