import { Request, Response } from 'express';
import { ShoppingListsRepository } from '../database/repository/shoppingLists.repository';
import { createShoppingListZodSchema } from '../validation/validation';
import { ItemsRepository } from '../database/repository/items.repository';

export class ShoppingListsController {
  constructor(
    private readonly shoppingListsRepository: ShoppingListsRepository,
    private readonly ItemsRepository: ItemsRepository,
  ) {}

  async getShoppingListById(req: Request, res: Response): Promise<void> {
    const shoppingList = await this.shoppingListsRepository.getShoppingListById(
      req.params.id,
    );
    if (!shoppingList) {
      res.status(404).send('ShoppingList not found');
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

    const itemsWithName = [];
    const itemsWithId = [];

    if (validatedData.items) {
      for (const item of validatedData.items) {
        if (item.id) {
          itemsWithId.push(item.id);
        } else if (item.name) {
          itemsWithName.push({
            name: item.name,
            description: item.description,
          });
        }
      }
    }

    if (itemsWithName.length > 0) {
      await this.ItemsRepository.createItems(itemsWithName);
    }

    if (itemsWithId.length > 0) {
      const items = await this.ItemsRepository.getItemsByNamesOrIds(
        itemsWithName.map((item) => item.name),
        itemsWithId,
      );
      await this.shoppingListsRepository.associateItemsWithShoppingList(
        createdShoppingList.id,
        items.map((item) => item.id),
      );
    }

    res.status(201).send(createdShoppingList);
  }

  async deleteShoppingList(req: Request, res: Response): Promise<void> {
    await this.shoppingListsRepository.deleteShoppingList(req.params.id);
    res.status(204).send();
  }

  async updateShoppingList(req: Request, res: Response): Promise<void> {
    const updatedShoppingList =
      await this.shoppingListsRepository.updateShoppingList(
        req.params.id,
        req.body,
      );
    res.status(200).send(updatedShoppingList);
  }
}
