import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

// Import routes
import eventTypeRoutes from './routes/eventTypes.js'
import bookingRoutes from './routes/bookings.js'
import availabilityRoutes from './routes/availability.js'
import publicRoutes from './routes/public.js'
import authRoutes from './routes/auth.js'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/event-types', eventTypeRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/public', publicRoutes)

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
})

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
})
