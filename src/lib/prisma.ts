import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

function resolveDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  const dbPath = dbUrl.replace(/^file:/, '')
  const resolvedPath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath)
  return resolvedPath
}

function createPrismaClient(): PrismaClient {
  const dbPath = resolveDatabaseUrl()
  const adapter = new PrismaBetterSqlite3({ url: dbPath })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  } as ConstructorParameters<typeof PrismaClient>[0])
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
