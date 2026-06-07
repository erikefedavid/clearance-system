import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial administrator and officer accounts...')

  // Clean existing non-student users if necessary (be careful with this in prod)
  // await prisma.user.deleteMany({ where: { role: { not: 'STUDENT' } } })

  const adminPasswordHash = await bcrypt.hash('admin123', 12)
  const officerPasswordHash = await bcrypt.hash('officer123', 12)

  // Create Registry Admin
  await prisma.user.upsert({
    where: { email: 'registry@lcu.edu.ng' },
    update: {},
    create: {
      email: 'registry@lcu.edu.ng',
      passwordHash: adminPasswordHash,
      role: Role.REGISTRY,
    },
  })

  // Create Unit Officers
  const units = ['LIBRARY', 'BURSARY', 'DEPARTMENT', 'FACULTY']
  
  for (const unit of units) {
    await prisma.user.upsert({
      where: { email: `${unit.toLowerCase()}@lcu.edu.ng` },
      update: {},
      create: {
        email: `${unit.toLowerCase()}@lcu.edu.ng`,
        passwordHash: officerPasswordHash,
        role: Role.OFFICER,
        unitName: unit,
      },
    })
  }

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
