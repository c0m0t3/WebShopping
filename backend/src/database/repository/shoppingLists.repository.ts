import type { Database } from '..';
import { CreateShoppingList } from '../../validation/validation';
import { shoppingLists } from '../schema/shoppingLists.schema';
import { shoppingListItems } from '../schema/shoppingListItems.schema';
import { and, eq, like, or } from 'drizzle-orm';

export class ShoppingListsRepository {
  constructor(private readonly database: Database) {}

  // Clear all shopping lists and items
  async clear(): Promise<void> {
    await this.database.delete(shoppingListItems).execute();
    await this.database.delete(shoppingLists).execute();
  }

  // Check if a shopping list exists by name
  async shoppingListExistsByName(name: string): Promise<boolean> {
    const result = await this.database.query.shoppingLists.findFirst({
      where: (shoppingLists) => eq(shoppingLists.name, name),
    });
    return !!result;
  }

  // Get shopping list by ID
  async getShoppingListById(id: string) {
    const shoppingList = await this.database.query.shoppingLists.findFirst({
      where: (shoppingLists) => eq(shoppingLists.id, id),
    });
    return shoppingList || null;
  }

  // Get all shopping lists
  async getShoppingLists(includeRelations = false) {
    const queryConfig = {
      with: includeRelations
        ? {
            shoppingListItems: {
              select: {
                quantity: true,
                isPurchased: true,
              },
            },
          }
        : undefined,
    };
    return this.database.query.shoppingLists.findMany(queryConfig);
  }

  // Create a new shopping list
  async createShoppingList(data: CreateShoppingList) {
    const existingShoppingList =
      await this.database.query.shoppingLists.findFirst({
        where: (shoppingLists) => eq(shoppingLists.name, data.name),
      });

    if (existingShoppingList) {
      return null;
    }

    const [createdShoppingList] = await this.database
      .insert(shoppingLists)
      .values({
        ...data,
        description: data.description ?? '',
        store: data.store ?? '',
      })
      .returning({
        id: shoppingLists.id,
        name: shoppingLists.name,
        description: shoppingLists.description,
        store: shoppingLists.store,
      });

    return createdShoppingList;
  }

  // Delete shopping list by ID
  async deleteShoppingList(id: string): Promise<number> {
    const result = await this.database
      .delete(shoppingLists)
      .where(eq(shoppingLists.id, id));
    return result.rowCount ?? 0; // Provide a default value of 0 if rowCount is null
  }

  // Update shopping list by ID
  async updateShoppingList(id: string, data: CreateShoppingList) {
    const result = await this.database
      .update(shoppingLists)
      .set({
        ...data,
        description: data.description ?? '', // Provide a default value if description is null or undefined
        store: data.store ?? '', // Provide a default value if store is null or undefined
      })
      .where(eq(shoppingLists.id, id));

    return (result.rowCount ?? 0) > 0 ? result : null;
  }

  // Associate items with shopping list
  async associateItemsWithShoppingList(
    shoppingListId: string,
    items: { itemId: string; quantity?: number }[],
  ) {
    const shoppingListExists =
      await this.database.query.shoppingLists.findFirst({
        where: (shoppingLists) => eq(shoppingLists.id, shoppingListId),
      });

    if (!shoppingListExists) {
      return null;
    }

    for (const item of items) {
      const existingItem =
        await this.database.query.shoppingListItems.findFirst({
          where: (shoppingListItems) =>
            and(
              eq(shoppingListItems.shoppingListId, shoppingListId),
              eq(shoppingListItems.itemId, item.itemId),
            ),
        });

      if (existingItem) {
        await this.database
          .update(shoppingListItems)
          .set({
            quantity: (existingItem.quantity ?? 1) + (item.quantity ?? 1),
          })
          .where(
            and(
              eq(shoppingListItems.shoppingListId, shoppingListId),
              eq(shoppingListItems.itemId, item.itemId),
            ),
          );
      } else {
        await this.database.insert(shoppingListItems).values({
          shoppingListId,
          itemId: item.itemId,
          quantity: item.quantity ?? 1,
        });
      }
    }
  }

  // Remove item from shopping list
  async removeItemFromShoppingList(shoppingListId: string, itemId: string) {
    const existingItem = await this.database.query.shoppingListItems.findFirst({
      where: (shoppingListItems) =>
        and(
          eq(shoppingListItems.shoppingListId, shoppingListId),
          eq(shoppingListItems.itemId, itemId),
        ),
    });

    if (!existingItem) {
      return null;
    }

    return this.database
      .delete(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.shoppingListId, shoppingListId),
          eq(shoppingListItems.itemId, itemId),
        ),
      );
  }

  // Update shopping list items
  async updateShoppingListItems(
    shoppingListId: string,
    itemId: string,
    quantity: number,
    is_purchased: boolean,
  ) {
    if (quantity < 1) {
      return null;
    }

    return this.database
      .update(shoppingListItems)
      .set({
        quantity,
        is_purchased,
      })
      .where(
        and(
          eq(shoppingListItems.shoppingListId, shoppingListId),
          eq(shoppingListItems.itemId, itemId),
        ),
      );
  }

  // Get items from shopping list
  async getShoppingListItems(shoppingListId: string) {
    const shoppingListExists =
      await this.database.query.shoppingLists.findFirst({
        where: (shoppingLists) => eq(shoppingLists.id, shoppingListId),
      });

    if (!shoppingListExists) {
      return null;
    }

    return this.database.query.shoppingListItems.findMany({
      where: (shoppingListItems) =>
        eq(shoppingListItems.shoppingListId, shoppingListId),
    });
  }

  // Search shopping lists
  async searchShoppingLists(query: string) {
    return this.database.query.shoppingLists.findMany({
      where: (shoppingLists) =>
        or(
          like(shoppingLists.name, `%${query}%`),
          like(shoppingLists.description, `%${query}%`),
        ),
    });
  }

  // Search shopping lists by item
  async searchShoppingListsByItem(itemId: string) {
    return this.database.query.shoppingListItems.findMany({
      where: (shoppingListItems) => eq(shoppingListItems.itemId, itemId),
    });
  }

  // Get store associated with shopping list
  async getShoppingListStore(id: string) {
    const shoppingList = await this.database.query.shoppingLists.findFirst({
      where: (shoppingLists) => eq(shoppingLists.id, id),
    });
    return shoppingList?.store;
  }

  // Set store for shopping list
  async setShoppingListStore(id: string, store: string) {
    const result = await this.database
      .update(shoppingLists)
      .set({ store })
      .where(eq(shoppingLists.id, id));

    return (result.rowCount ?? 0) > 0 ? result : null;
  }

  // Get shopping lists by store
  async getShoppingListsByStore(store: string) {
    return this.database.query.shoppingLists.findMany({
      where: (shoppingLists) => like(shoppingLists.store, `%${store}%`),
    });
  }
}
