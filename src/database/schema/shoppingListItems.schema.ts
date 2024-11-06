import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { commonSchema } from './common.schema';

export const shoppingListItems = pgTable('shoppingListItems', {
  ...commonSchema,
  shoppingListId: varchar({ length: 256 }).notNull(),
  itemId: varchar({ length: 256 }).notNull(),
  quantity: integer().notNull(),
});