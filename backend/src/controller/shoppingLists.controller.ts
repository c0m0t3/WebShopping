import { Request, Response } from 'express';
import { ShoppingListsRepository } from '../database/repository/shoppingLists.repository';
import { createShoppingListZodSchema } from '../validation/validation';
import { updateShoppingListZodSchema } from '../validation/validation';
import { ItemsRepository } from '../database/repository/items.repository';

export class ShoppingListsController {
  constructor(
    private readonly shoppingListsRepository: ShoppingListsRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async getShoppingListById(req: Request, res: Response): Promise<void> {
    const shoppingList = await this.shoppingListsRepository.getShoppingListById(
      req.params.id,
    );
    console.log(shoppingList);
    if (!shoppingList) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }
    res.status(200).send(shoppingList);
  }

  async getShoppingLists(req: Request, res: Response): Promise<void> {
    const shoppingLists = await this.shoppingListsRepository.getShoppingLists();
    res.status(200).send(shoppingLists);
  }

  async createShoppingList(req: Request, res: Response): Promise<void> {
    const validatedData = createShoppingListZodSchema.parse(req.body);

    const createdShoppingList =
      await this.shoppingListsRepository.createShoppingList(validatedData);

    const itemsWithName: { name: string; description?: string; quantity?: number }[] = [];
    const itemsWithId: { id: string; quantity?: number }[] = [];

    if (validatedData.items) {
      for (const item of validatedData.items) {
        if (item.id) {
          itemsWithId.push({
            id: item.id,
            quantity: item.quantity,
          });
        } else if (item.name) {
          itemsWithName.push({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
          });
        }
      }
    }

    if (itemsWithName.length > 0) {
      await this.itemsRepository.createItems(itemsWithName);
    }

    if (itemsWithId.length > 0) {
      const items = await this.itemsRepository.getItemsByNamesOrIds(
        itemsWithName.map((item) => item.name),
        itemsWithId.map((item) => item.id),
      );
      await this.shoppingListsRepository.associateItemsWithShoppingList(
        createdShoppingList.id,
        items.map((item, index) => ({
          itemId: item.id,
          quantity: itemsWithId[index].quantity, // Ensure quantity is included if available
        })),
      );
    }

    res.status(201).send(createdShoppingList);
  }

  async deleteShoppingList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.shoppingListsRepository.deleteShoppingList(id);

    if (result === 0) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }

    res.status(204).send();
  }

  async updateShoppingList(req: Request, res: Response): Promise<void> {
      const validatedData = updateShoppingListZodSchema.parse(req.body);
      const updatedShoppingList = await this.shoppingListsRepository.updateShoppingList(req.params.id, validatedData);
      res.status(200).send(updatedShoppingList);
  }

  async associateItemsWithShoppingList(req: Request, res: Response): Promise<void> {
    const { items } = req.body;
    const itemIds = items.map((item: { itemId: string }) => item.itemId);

    for (const id of itemIds) {
      if (!id) {
        res.status(400).send('itemId is required');
        return;
      }

      const exists = await this.itemsRepository.getItemById(id);
      if (!exists) {
        res.status(404).send(`Item with id ${id} does not exist`);
        return;
      }
    }

    await this.shoppingListsRepository.associateItemsWithShoppingList(req.params.id, items);
    res.status(200).send('Items added to shopping list');
  }

  async removeItemFromShoppingList(req: Request, res: Response): Promise<void> {
    const { id, itemId } = req.params;
    await this.shoppingListsRepository.removeItemFromShoppingList(id, itemId);
    res.status(204).send();
  }

  async updateShoppingListItems(req: Request, res: Response): Promise<void> {
    const { id, itemId } = req.params;
    const { quantity, is_purchased } = req.body;
    await this.shoppingListsRepository.updateShoppingListItems(id, itemId, quantity, is_purchased);
    res.status(200).send();
  }

  async getShoppingListItems(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const items = await this.shoppingListsRepository.getShoppingListItems(id);
    res.status(200).send(items);
  }

  async searchShoppingLists(req: Request, res: Response): Promise<void> {
    const { query } = req.query;
    if (typeof query !== 'string') {
      res.status(400).send({ error: 'Query parameter is required and must be a string' });
      return;
    } else if(query.trim() === '') { // Check if query is empty and return an empty array
      res.status(200).send([]);
      return;
    }

    const results = await this.shoppingListsRepository.searchShoppingLists(query);
    res.send(results);
  }

  async searchShoppingListsByItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log("Search 2" + id);
    const results = await this.shoppingListsRepository.searchShoppingListsByItem(id);
    res.send(results);
  }
}
