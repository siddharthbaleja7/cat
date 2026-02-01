import express from 'express'
import { PrismaClient } from '@prisma/client'
import { auth } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

router.use(auth)

// Create/Update availability
router.post('/', async (req, res) => {
    try {
        const { eventTypeId, dayOfWeek, startTime, endTime, timezone } = req.body

        const availability = await prisma.availability.upsert({
            where: {
                eventTypeId_dayOfWeek: {
                    eventTypeId,
                    dayOfWeek: parseInt(dayOfWeek)
                }
            },
            create: {
                eventTypeId,
                dayOfWeek: parseInt(dayOfWeek),
                startTime,
                endTime,
                timezone: timezone || 'UTC'
            },
            update: {
                startTime,
                endTime,
                timezone: timezone || 'UTC'
            }
        })

        res.status(201).json({ success: true, data: availability })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get availability for event type
router.get('/:eventTypeId', async (req, res) => {
    try {
        const availability = await prisma.availability.findMany({
            where: { eventTypeId: req.params.eventTypeId },
            orderBy: { dayOfWeek: 'asc' }
        })

        res.json({ data: availability })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Delete availability
router.delete('/:id', async (req, res) => {
    try {
        await prisma.availability.delete({
            where: { id: req.params.id }
        })

        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
