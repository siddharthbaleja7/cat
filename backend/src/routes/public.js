import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get event type by slug
router.get('/:slug', async (req, res) => {
    try {
        const eventType = await prisma.eventType.findUnique({
            where: { slug: req.params.slug },
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

// Get available slots for date
router.get('/:slug/availability', async (req, res) => {
    try {
        const { date } = req.query
        if (!date) {
            return res.status(400).json({ error: 'Date required' })
        }

        const eventType = await prisma.eventType.findUnique({
            where: { slug: req.params.slug },
            include: { availability: true }
        })

        if (!eventType) {
            return res.status(404).json({ error: 'Not found' })
        }

        const queryDate = new Date(date)
        const dayOfWeek = queryDate.getDay() // 0 = Sunday

        // Fix: In JS Date.getDay() is 0 (Sunday) - 6 (Saturday). 
        // In our seed, we used 1-5 for Mon-Fri.
        // We should ensure consistency. 
        // Prisma seed uses dayOfWeek explicitly.

        const dayAvailability = eventType.availability.find(
            av => av.dayOfWeek === dayOfWeek
        )

        if (!dayAvailability) {
            return res.json({ slots: [] })
        }

        // Generate time slots
        const slots = []
        const [startHour, startMin] = dayAvailability.startTime.split(':')
        const [endHour, endMin] = dayAvailability.endTime.split(':')

        let current = new Date(queryDate)
        current.setHours(parseInt(startHour), parseInt(startMin), 0, 0)

        // We need to set the date part correctly to match 'date' query parameter
        // Assuming 'date' is YYYY-MM-DD

        const end = new Date(queryDate)
        end.setHours(parseInt(endHour), parseInt(endMin), 0, 0)

        while (current < end) {
            const slotStart = new Date(current)
            const slotEnd = new Date(current.getTime() + eventType.duration * 60000)

            // Check if slotEnd exceeds day availability end
            if (slotEnd > end) break;

            // Check if booked
            const booked = await prisma.booking.findFirst({
                where: {
                    eventTypeId: eventType.id,
                    status: 'confirmed',
                    startTime: slotStart
                }
            })

            if (!booked) {
                slots.push({
                    time: current.toTimeString().slice(0, 5),
                    available: true
                })
            }

            current.setMinutes(current.getMinutes() + eventType.duration)
        }

        res.json({ slots })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

export default router
