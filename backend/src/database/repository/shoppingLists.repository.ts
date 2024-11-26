import type { Database } from '..';
import { CreateShoppingList } from '../../validation/validation';
import { shoppingLists } from '../schema/shoppingLists.schema';
import { shoppingListItems } from '../schema/shoppingListItems.schema';
import { and, eq } from 'drizzle-orm';

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
    const shoppingList = await this.database.query.shoppingLists.findFirst({
      where: (itemLists, { eq }) => eq(itemLists.id, id),
    });
    return shoppingList || null;
  }

  async getShoppingLists(includeRelations = false) {
    //console.log("getShoppingLists in repository called");
    //try {
    const queryConfig = {
      with: includeRelations
        ? {
            shoppingListItems: {
              select: {
                quantity: true,
                is_purchased: true,
              },
            },
          }
        : undefined,
    };
    //console.log("Generated query config:", queryConfig);
    const result =
      await this.database.query.shoppingLists.findMany(queryConfig);
    //console.log("Query result:", result);
    return result;
    // } catch (error) {
    //   //console.error("Detailed error:", error);  // Detailliertere Fehlerausgabe
    //   throw new Error("Error fetching shopping lists");
    // }
  }

  async createShoppingList(data: CreateShoppingList) {
    // Check if the shopping list already exists by name
    const existingShoppingList =
      await this.database.query.shoppingLists.findFirst({
        where: (shoppingLists, { eq }) => eq(shoppingLists.name, data.name),
      });

    if (existingShoppingList) {
      return null;
    }

    const [createdShoppingList] = await this.database
      .insert(shoppingLists)
      .values({
        ...data,
        description: data.description ?? '', // Provide a default value if description is undefined
        store: data.store ?? '', // Provide a default value if store is undefined
      })
      .returning({
        id: shoppingLists.id,
        name: shoppingLists.name,
        description: shoppingLists.description,
        store: shoppingLists.store,
      });

    return createdShoppingList;
  }

  async deleteShoppingList(id: string): Promise<number> {
    const result = await this.database
      .delete(shoppingLists)
      .where(eq(shoppingLists.id, id));
    return result.rowCount ?? 0; // Provide a default value of 0 if rowCount is null
  }

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

  async associateItemsWithShoppingList(
    shoppingListId: string,
    items: { itemId: string; quantity?: number }[],
  ) {
    const shoppingListExists =
      await this.database.query.shoppingLists.findFirst({
        where: (shoppingLists, { eq }) => eq(shoppingLists.id, shoppingListId),
      });

    if (!shoppingListExists) {
      return null;
    }

    for (const item of items) {
      const existingItem =
        await this.database.query.shoppingListItems.findFirst({
          where: (shoppingListItems, { and, eq }) =>
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

  async removeItemFromShoppingList(shoppingListId: string, itemId: string) {
    const existingItem = await this.database.query.shoppingListItems.findFirst({
      where: (shoppingListItems, { and, eq }) =>
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

  async getShoppingListItems(shoppingListId: string) {
    const shoppingListExists =
      await this.database.query.shoppingLists.findFirst({
        where: (shoppingLists, { eq }) => eq(shoppingLists.id, shoppingListId),
      });

    if (!shoppingListExists) {
      return null;
    }

    const items = await this.database.query.shoppingListItems.findMany({
      where: (items, { eq }) => eq(items.shoppingListId, shoppingListId),
    });

    return items;
  }

  async searchShoppingLists(query: string) {
    return this.database.query.shoppingLists.findMany({
      where: (shoppingLists, { or, like }) =>
        or(
          like(shoppingLists.name, `%${query}%`),
          like(shoppingLists.description, `%${query}%`),
        ),
    });
  }

  async searchShoppingListsByItem(itemId: string) {
    return this.database.query.shoppingListItems.findMany({
      where: (items, { eq }) => eq(items.itemId, itemId),
    });
  }

  async getShoppingListStore(id: string) {
    const shoppingList = await this.database.query.shoppingLists.findFirst({
      where: (shoppingLists, { eq }) => eq(shoppingLists.id, id),
    });
    return shoppingList?.store;
  }

  async setShoppingListStore(id: string, store: string) {
    const result = await this.database
      .update(shoppingLists)
      .set({
        store,
      })
      .where(eq(shoppingLists.id, id));

    return (result.rowCount ?? 0) > 0 ? result : null;
  }

  async getShoppingListsByStore(store: string) {
    return this.database.query.shoppingLists.findMany({
      where: (shoppingLists, { like }) =>
        like(shoppingLists.store, `%${store}%`),
    });
  }
}
