// src/lib/db.ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Optional: logs all DB queries to help during dev
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;


