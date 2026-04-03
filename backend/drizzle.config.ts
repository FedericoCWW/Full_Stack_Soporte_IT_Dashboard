import { config } from 'dotenv';
config({ path: '../.env' });

import { defineConfig } from 'drizzle-kit';

if(!process.env.DATABASE_URL){
  throw new Error("¡DATABASE_URL no se definio!")
}

export default defineConfig({
  schema: './src/db/schema/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
