import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { commonSchema } from './common.schema';

export const items = pgTable('items', {
  ...commonSchema,
  name: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 256 }),
});
