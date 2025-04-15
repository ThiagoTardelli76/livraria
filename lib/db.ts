import { Pool } from 'pg';

const globalForPool = globalThis as unknown as {
  pgPool: Pool | undefined;
};

const pool = globalForPool.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

if (!globalForPool.pgPool) globalForPool.pgPool = pool;

export default pool;
