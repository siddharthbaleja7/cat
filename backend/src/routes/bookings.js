import express from 'express'
import { PrismaClient } from '@prisma/client'
import { auth } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Create booking (Public)
router.post('/', async (req, res) => {
    try {
        const { eventTypeId, guestName, guestEmail, guestPhone, startTime, endTime, notes } = req.body

        // Get the event type to find the owner (user)
        const eventType = await prisma.eventType.findUnique({
            where: { id: eventTypeId }
        })

        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' })
        }

        // Check for conflicts
        const conflict = await prisma.booking.findFirst({
            where: {
                eventTypeId,
                status: 'confirmed',
                startTime: { lt: new Date(endTime) },
                endTime: { gt: new Date(startTime) }
            }
        })

        if (conflict) {
            return res.status(409).json({ error: 'Time slot already booked' })
        }

        const booking = await prisma.booking.create({
            data: {
                eventTypeId,
                userId: eventType.userId, // Use the event owner's ID
                guestName,
                guestEmail,
                guestPhone: guestPhone || null,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes: notes || null,
                status: 'confirmed'
            }
        })

        res.status(201).json({ success: true, data: booking })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

// Get bookings (Protected)
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.userId },
            include: { eventType: true },
            orderBy: { startTime: 'desc' }
        })

        res.json({ data: bookings })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Cancel booking (Protected)
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status: 'cancelled' }
        })

        res.json({ success: true, data: booking })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
