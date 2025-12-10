import dotenv from 'dotenv'
dotenv.config()   // ✅ LOAD ENV FIRST

import express from 'express'
import cors from 'cors'
import connectDB from './db.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

// ✅ MIDDLEWARE
app.use(express.json())

// ✅ CORS CONFIG
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// ✅ TEST API
app.get('/', (req, res) => {
  res.send('✅ Backend working fine')
})

// ✅ ROUTES
app.use('/api/auth', authRoutes)

// ✅ GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error('🔥 Backend error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

// ✅ CONNECT DATABASE
connectDB()

export default app
