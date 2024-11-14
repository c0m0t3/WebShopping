import type { Database } from '..';
import { CreateItem } from '../../validation/validation';
import { shoppingLists } from '../schema/shoppingLists.schema';
import { shoppingListItems } from '../schema/shoppingListItems.schema';
import { eq } from 'drizzle-orm';

export class ShoppingListsRepository {
  constructor(private readonly database: Database) {}

  async getShoppingListById(id: string) {
    return this.database.query.shoppingLists.findFirst({
      where: (itemLists, { eq }) => eq(itemLists.id, id),
    });
  }

  async getShoppingLists() {
    return this.database.query.shoppingLists.findMany();
  }

  async createShoppingList(data: CreateItem) {
    const [createdShoppingList] = await this.database
      .insert(shoppingLists)
      .values({
        ...data,
        description: data.description ?? '', // Provide a default value if description is undefined
      })
      .returning({
        id: shoppingLists.id,
        name: shoppingLists.name,
        description: shoppingLists.description,
      });

    return createdShoppingList;
  }

  async deleteShoppingList(id: string) {
    return this.database.delete(shoppingLists).where(eq(shoppingLists.id, id));
  }

  async updateShoppingList(id: string, data: CreateItem) {
    return this.database
      .update(shoppingLists)
      .set({
        ...data,
        description: data.description ?? '', // Provide a default value if description is null or undefined
      })
      .where(eq(shoppingLists.id, id));
  }

  async associateItemsWithShoppingList(
    shoppingListId: string,
    itemIds: string[],
  ) {
    return this.database.insert(shoppingListItems).values(
      itemIds.map((itemId) => ({
        shoppingListId,
        itemId,
        quantity: 1,
      })),
    );
  }
}
