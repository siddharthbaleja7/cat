import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  // Create default user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      username: 'user123',
      name: 'Test User',
      password: hashedPassword
    }
  })

  // Create sample event types
  const eventType1 = await prisma.eventType.upsert({
    where: { slug: '30min' },
    update: {},
    create: {
      userId: user.id,
      title: '30 Minute Meeting',
      slug: '30min',
      description: 'A quick 30-minute meeting',
      duration: 30,
      color: '#000000'
    }
  })

  // Add availability (Mon-Fri, 9AM-5PM)
  // Add availability (Mon-Fri, 9AM-5PM)
  // Clear existing first
  await prisma.availability.deleteMany({
    where: { eventTypeId: eventType1.id }
  })

  // Create new
  await prisma.availability.createMany({
    data: [1, 2, 3, 4, 5].map(day => ({
      eventTypeId: eventType1.id,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'America/New_York'
    }))
  })

  console.log('Database seeded!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
