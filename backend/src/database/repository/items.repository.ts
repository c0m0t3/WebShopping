import type { Database } from '..';
import { CreateItem } from '../../validation/validation';
import { items } from '../schema/items.schema';
import { eq } from 'drizzle-orm';

export class ItemsRepository {
  constructor(private readonly database: Database) {}

  async getItemById(id: string) {
    return this.database.query.items.findFirst({
      where: (items, { eq }) => eq(items.id, id),
    });
  }

  async getItemsByNamesOrIds(names: string[], ids: string[]) {
    return this.database.query.items.findMany({
      where: (items, { and, or, inArray }) =>
        and(or(inArray(items.id, ids), inArray(items.name, names))),
    });
  }

  async createItems(data: { name: string; description?: string }[]) {
    return this.database.insert(items).values(data).returning({
      id: items.id,
      name: items.name,
      description: items.description,
    });
  }

  async deleteItemFromDatabase(id: string) {
    return this.database.delete(items).where(eq(items.id, id));
  }

  async updateItem(id: string, data: CreateItem) {
    return this.database.update(items).set(data).where(eq(items.id, id));
  }
}
