import type { Database } from '..';
import { CreateItem } from '../../validation/validation';
import { items } from '../schema/items.schema';
import { eq } from 'drizzle-orm';

export class ItemsRepository {
  constructor(private readonly database: Database) {}

  async checkItemsExist(names: string[]): Promise<string[]> {
    const existingItems = await this.database.query.items.findMany({
      where: (items, { inArray }) => inArray(items.name, names),
    });
    return existingItems.map((item) => item.name);
  }

  async getItemById(id: string) {
    const item = await this.database.query.items.findFirst({
      where: (items, { eq }) => eq(items.id, id),
    });
    return item || null;
  }

  async getItemsById(ids: string[]) {
    return this.database.query.items.findMany({
      where: (items, { inArray }) => inArray(items.id, ids),
    });
  }

  async getItems() {
    return this.database.query.items.findMany();
  }

  async getItemsByNamesOrIds(names: string[], ids: string[]) {
    return this.database.query.items.findMany({
      where: (items, { and, or, inArray }) =>
        and(or(inArray(items.id, ids), inArray(items.name, names))),
    });
  }

  async createItems(data: { name: string; description?: string }[]) {
    data.forEach((item) => {
      if (item.name === '') {
        throw new Error('Item name can not be empty');
      }
    });

    const itemNames = data.map((item) => item.name);
    const existingItemNames = await this.checkItemsExist(itemNames);

    const itemsToInsert = data.filter(
      (item) => !existingItemNames.includes(item.name),
    );

    if (itemsToInsert.length === 0) {
      return [];
    }

    return this.database.insert(items).values(itemsToInsert).returning({
      id: items.id,
      name: items.name,
      description: items.description,
    });
  }

  async isItemOnShoppingList(itemId: string): Promise<boolean> {
    const shoppingListItem =
      await this.database.query.shoppingListItems.findFirst({
        where: (shoppingListItems, { eq }) =>
          eq(shoppingListItems.itemId, itemId),
      });
    return !!shoppingListItem;
  }

  // Update the deleteItemFromDatabase method
  async deleteItemFromDatabase(id: string) {
    const existingItem = await this.getItemById(id);

    if (!existingItem) {
      return null;
    }

    if (await this.isItemOnShoppingList(id)) {
      throw new Error('Item is associated with a shopping list');
    }

    return this.database.delete(items).where(eq(items.id, id));
  }

  async updateItem(id: string, data: CreateItem) {
    const existingItem = await this.getItemById(id);

    if (!existingItem) {
      return null;
    }

    if (data.name === '') {
      throw new Error('Item name cannot be empty');
    }

    const itemWithSameName = await this.database.query.items.findFirst({
      where: (items, { and, eq, ne }) =>
        and(eq(items.name, data.name), ne(items.id, id)),
    });

    if (itemWithSameName) {
      throw new Error('An item with the same name already exists');
    }

    return this.database
      .update(items)
      .set(data)
      .where(eq(items.id, id))
      .returning({
        id: items.id,
        name: items.name,
        description: items.description,
      });
  }
}
