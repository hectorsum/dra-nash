import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  pool: Pool;
};

// Extract actual database URL from Prisma Postgres connection string
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not defined');
  
  // Check if this is a Prisma Postgres URL with api_key
  const urlObj = new URL(url);
  const apiKey = urlObj.searchParams.get('api_key');
  
  if (apiKey) {
    // Decode the base64-encoded JSON to get the actual database URL
    try {
      const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
      const config = JSON.parse(decoded);
      return config.databaseUrl || url;
    } catch (e) {
      console.error('Failed to decode api_key, using original URL:', e);
      return url;
    }
  }
  
  return url;
}

// Create connection pool
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: getDatabaseUrl(),
  });
}

const adapter = new PrismaPg(globalForPrisma.pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
