import { defineConfig } from 'drizzle-kit';
import { ENV } from './env.config';

export default defineConfig({
    dialect: 'postgresql', // Ensure this matches your database
    out: './src/database/migrations', // Directory for migration files
    schema: './src/database/schema',
    casing: "snake_case",
    dbCredentials: {
        url: ENV.DATABASE_URL,
    },
    migrations: {
        table: 'migrations', // Table to track migrations
    }
});