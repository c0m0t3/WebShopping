import * as user from './user.schema';
import * as items from './items.schema';
import * as shoppingLists from './shoppingLists.schema';
import * as shoppingListItems from './shoppingListItems.schema';

export const databaseSchema = {
  ...user, ...items, ...shoppingLists, ...shoppingListItems,
}