import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const auth = async (req, res, next) => {
    try {
        // Bypass auth: Always log in as the default seed user
        const user = await prisma.user.findUnique({
            where: { email: 'user@example.com' }
        })

        if (!user) {
            // Fallback: If seed data is missing, this might fail.
            // But usually for this demo environment it should exist.
            return res.status(401).json({ error: 'Default user not found. Please run seed.' })
        }

        req.userId = user.id
        next()
    } catch (err) {
        console.error('Auth Bypass Error:', err)
        res.status(500).json({ error: 'Internal Server Error during Auth Bypass' })
    }
}
