import { pgTable, varchar} from 'drizzle-orm/pg-core';
import { commonSchema } from './common.schema';

export const shoppingLists = pgTable('shoppingLists', {
  ...commonSchema,
  name: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 256 }).notNull(),
  store: varchar({ length: 256 }),
});