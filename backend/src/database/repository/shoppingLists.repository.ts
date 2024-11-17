import type { Database } from '..';
import { CreateItem } from '../../validation/validation';
import { shoppingLists } from '../schema/shoppingLists.schema';
import { shoppingListItems } from '../schema/shoppingListItems.schema';
import { eq, and } from 'drizzle-orm';

export class ShoppingListsRepository {
  constructor(private readonly database: Database) {}

  async clear() {
    await this.database.delete(shoppingListItems).execute();
    await this.database.delete(shoppingLists).execute();
  }

  async shoppingListExistsByName(name: string): Promise<boolean> {
    const result = await this.database.query.shoppingLists.findFirst({
      where: (shoppingLists, { eq }) => eq(shoppingLists.name, name),
    });
    return !!result;
  }

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

  async deleteShoppingList(id: string): Promise<number> {
    const result = await this.database.delete(shoppingLists).where(eq(shoppingLists.id, id));
    return result.rowCount ?? 0; // Provide a default value of 0 if rowCount is null
  }

  async updateShoppingList(id: string, data: CreateItem) {
    const result = await this.database
      .update(shoppingLists)
      .set({
        ...data,
        description: data.description ?? '', // Provide a default value if description is null or undefined
      })
      .where(eq(shoppingLists.id, id));

    return (result.rowCount ?? 0) > 0 ? result : null;
  }

  async associateItemsWithShoppingList(
    shoppingListId: string,
    items: { itemId: string; quantity?: number }[],
  ) {
    const shoppingListExists = await this.database.query.shoppingLists.findFirst({
      where: (shoppingLists, { eq }) => eq(shoppingLists.id, shoppingListId),
    });

    if (!shoppingListExists) {
      return null;
    }

    for (const item of items) {
      const existingItem = await this.database.query.shoppingListItems.findFirst({
        where: (shoppingListItems, { and, eq }) =>
          and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, item.itemId)),
      });

      if (existingItem) {
        await this.database.update(shoppingListItems)
          .set({
            quantity: (existingItem.quantity ?? 1) + (item.quantity ?? 1),
          })
          .where(and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, item.itemId)));
      } else {
        await this.database.insert(shoppingListItems).values({
          shoppingListId,
          itemId: item.itemId,
          quantity: item.quantity ?? 1,
        });
      }
    }
  }

  async removeItemFromShoppingList(shoppingListId: string, itemId: string) {
    const existingItem = await this.database.query.shoppingListItems.findFirst({
      where: (shoppingListItems, { and, eq }) =>
        and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, itemId)),
    });

    if (!existingItem) {
      return null;
    }

    return this.database
      .delete(shoppingListItems)
      .where(and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, itemId)));
  }

  async updateShoppingListItems(shoppingListId: string, itemId: string, quantity: number, is_purchased: boolean) {
    if (quantity < 1) {
      return null;
    }

    return this.database
      .update(shoppingListItems)
      .set({
        quantity,
        is_purchased,
      })
      .where(and(eq(shoppingListItems.shoppingListId, shoppingListId), eq(shoppingListItems.itemId, itemId)));
  }

  async getShoppingListItems(shoppingListId: string) {
    const items = await this.database.query.shoppingListItems.findMany({
      where: (items, { eq }) => eq(items.shoppingListId, shoppingListId),
    });

    return items.length > 0 ? items : null;
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
