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

  async createItem(data: CreateItem) {
    return this.database.insert(items).values(data).returning({
      id: items.id,
      name: items.name,
      description: items.description,
    });
  }

  async deleteItemFromDatabase(id: string) {
    return this.database
      .delete(items)
      .where(eq(items.id, id));
  }





}