import { boolean, integer, primaryKey, pgTable, foreignKey, uuid } from 'drizzle-orm/pg-core';
import { items } from './items.schema';
import { shoppingLists } from './shoppingLists.schema';

export const shoppingListItems = pgTable('shoppingListItems', {
  shoppingListId: uuid().notNull(),
  itemId: uuid().notNull(),
  quantity: integer().notNull(),
  is_purchased: boolean().default(false),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.shoppingListId, table.itemId] }),
    fkShoppingList: foreignKey({ columns: [table.shoppingListId], foreignColumns: [shoppingLists.id] }),
    fkItem: foreignKey({ columns: [table.itemId], foreignColumns: [items.id] }),
  };
});