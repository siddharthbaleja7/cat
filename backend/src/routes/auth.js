import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

const router = express.Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Signup
router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').notEmpty().withMessage('Username is required')
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password, username } = req.body

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return res.status(400).json({ error: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, email: user.email, username: user.username } })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

// Login
router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return res.status(400).json({ error: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, email: user.email, username: user.username } })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router
