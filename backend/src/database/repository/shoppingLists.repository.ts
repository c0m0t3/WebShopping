import type { Database } from '..';
import { CreateItem } from '../../validation/validation';
import { shoppingLists } from '../schema/shoppingLists.schema';
import { shoppingListItems } from '../schema/shoppingListItems.schema';
import { eq, and } from 'drizzle-orm';

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
    items: { itemId: string; quantity?: number }[],
  ) {
    return this.database.insert(shoppingListItems).values(
      items.map((item) => ({
        shoppingListId,
        itemId: item.itemId,
        quantity: item.quantity ?? 1, // Default quantity to 1 if not provided
      })),
    );
  }
  async removeItemFromShoppingList(shoppingListId: string, itemId: string) {
    return this.database
      .delete(shoppingListItems)
      .where(and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, itemId)));
  }

  async updateShoppingListItems(shoppingListId: string, itemId: string, quantity: number, is_purchased: boolean) {
    return this.database
      .update(shoppingListItems)
      .set({
        quantity,
        is_purchased,
      })
      .where(and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, itemId)));
  }

  async getShoppingListItems(shoppingListId: string) {
    return this.database.query.shoppingListItems.findMany({
      where: (items, { eq }) => eq(items.shoppingListId, shoppingListId),
    });
  }

  async searchShoppingLists(query: string) {
    return this.database.query.shoppingLists.findMany({
      where: (shoppingLists, { or, like }) =>
        or(like(shoppingLists.name, `%${query}%`), like(shoppingLists.description, `%${query}%`)),
    });
  }

  async searchShoppingListsByItem (itemId: string) {
    return this.database.query.shoppingListItems.findMany({
      where: (items, { eq }) => eq(items.itemId, itemId),
    });
  }

}
