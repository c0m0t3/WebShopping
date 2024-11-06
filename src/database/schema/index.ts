import * as user from './user.schema';
import * as items from './items.schema';
import * as shoppingLists from './shoppingLists.schema';

export const databaseSchema = {
  ...user, ...items, ...shoppingLists
}