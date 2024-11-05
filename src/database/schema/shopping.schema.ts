import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const shopping_lists = table(
  "shopping_lists",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar("name", { length: 256 }),
    description: t.varchar({ length: 256 }),
    creationDate: t.timestamp().defaultNow(),
  }
);

export const items = table(
  "items",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar({ length: 256 }),
    description: t.varchar({ length: 256 }),
  }
);

export const shopping_list_items = table(
  "shopping_list_items",
  {
    shoppingListId: t.integer().references(() => shopping_lists.id),
    itemId: t.integer().references(() => items.id),
    quantity: t.integer(),
    purchased: t.boolean(),
  }
);
