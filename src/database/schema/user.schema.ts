import { pgTable, varchar} from 'drizzle-orm/pg-core';
import { commonSchema } from './common.schema';

export const users = pgTable('users', {
  ...commonSchema,
  email: varchar({ length: 256 }).notNull(),
  password: varchar({ length: 256 }).notNull(),
  firstName: varchar({ length: 256 }).notNull(),
  lastName: varchar({ length: 256 }).notNull(),
});