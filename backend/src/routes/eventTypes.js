import express from 'express'
import { PrismaClient } from '@prisma/client'
import { auth } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Protect all routes
router.use(auth)

// Create event type
router.post('/', async (req, res) => {
    try {
        const { title, description, duration, slug, color } = req.body

        if (!title || !duration || !slug) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const eventType = await prisma.eventType.create({
            data: {
                userId: req.userId,
                title,
                description,
                duration: parseInt(duration),
                slug,
                color: color || '#000000',
                availability: {
                    create: [1, 2, 3, 4, 5].map(day => ({
                        dayOfWeek: day,
                        startTime: '09:00',
                        endTime: '17:00'
                    }))
                }
            }
        })

        res.status(201).json({ success: true, data: eventType })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

// Get all event types
router.get('/', async (req, res) => {
    try {
        const eventTypes = await prisma.eventType.findMany({
            where: { userId: req.userId },
            include: {
                availability: true,
                _count: { select: { bookings: true } }
            }
        })

        res.json({ data: eventTypes })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get single event type
router.get('/:id', async (req, res) => {
    try {
        const eventType = await prisma.eventType.findUnique({
            where: { id: req.params.id },
            include: { availability: true }
        })

        if (!eventType) {
            return res.status(404).json({ error: 'Not found' })
        }

        res.json({ data: eventType })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update event type
router.put('/:id', async (req, res) => {
    try {
        const { title, description, duration, color } = req.body

        const eventType = await prisma.eventType.update({
            where: { id: req.params.id },
            data: {
                title,
                description,
                duration: duration ? parseInt(duration) : undefined,
                color
            }
        })

        res.json({ success: true, data: eventType })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Delete event type
router.delete('/:id', async (req, res) => {
    try {
        await prisma.eventType.delete({
            where: { id: req.params.id }
        })

        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
