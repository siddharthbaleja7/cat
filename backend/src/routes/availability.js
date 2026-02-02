import express from 'express'
import { PrismaClient } from '@prisma/client'
import { auth } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

router.use(auth)

// --- Schedules ---

// Get all schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany({
            where: { userId: req.userId },
            include: { availability: true },
            orderBy: { isDefault: 'desc' }
        })
        res.json({ data: schedules })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Create schedule
router.post('/', async (req, res) => {
    try {
        const { name } = req.body
        const schedule = await prisma.schedule.create({
            data: {
                userId: req.userId,
                name,
                isDefault: false, // First one could be default logic
                availability: {
                    createMany: {
                        data: [
                            // Default 9-5 Mon-Fri
                            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
                            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
                            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
                            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
                            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
                        ]
                    }
                }
            },
            include: { availability: true }
        })
        res.status(201).json({ success: true, data: schedule })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update availability for a schedule or event type
// This endpoint needs to be flexible.
// POST /slots -> { scheduleId, slots: [] }
router.post('/slots', async (req, res) => {
    try {
        const { scheduleId, eventTypeId, slots } = req.body

        // Clear existing
        await prisma.availability.deleteMany({
            where: {
                OR: [
                    { scheduleId: scheduleId },
                    { eventTypeId: eventTypeId }
                ]
            }
        })

        // Create new
        if (slots && slots.length > 0) {
            await prisma.availability.createMany({
                data: slots.map(s => ({
                    scheduleId,
                    eventTypeId,
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    timezone: s.timezone || 'UTC'
                }))
            })
        }

        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Delete schedule
router.delete('/:id', async (req, res) => {
    try {
        await prisma.schedule.delete({
            where: { id: req.params.id }
        })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
