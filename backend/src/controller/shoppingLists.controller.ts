import { Request, Response } from 'express';
import { ShoppingListsRepository } from '../database/repository/shoppingLists.repository';
import { ItemsRepository } from '../database/repository/items.repository';
import { validate as isUUID } from 'uuid';
import {
  associateItemsWithShoppingListSchema,
  createShoppingListZodSchema,
  updateShoppingListZodSchema,
} from '../validation/validation';

export class ShoppingListsController {
  constructor(
    private readonly shoppingListsRepository: ShoppingListsRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  // Get shopping list by ID
  async getShoppingListById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const shoppingList =
      await this.shoppingListsRepository.getShoppingListById(id);
    if (!shoppingList) {
      res.status(404).send({ error: 'Shopping list not found' });
      return;
    }

    res.status(200).send(shoppingList);
  }

  // Get all shopping lists
  async getShoppingLists(req: Request, res: Response): Promise<void> {
    const shoppingLists = await this.shoppingListsRepository.getShoppingLists();
    res.status(200).send(shoppingLists);
  }

  // Create a new shopping list
  async createShoppingList(req: Request, res: Response): Promise<void> {
    let validatedData;
    try {
      validatedData = createShoppingListZodSchema.parse(req.body);
    } catch {
      res.status(400).send({ error: 'Invalid data' });
      return;
    }

    const exists = await this.shoppingListsRepository.shoppingListExistsByName(
      validatedData.name,
    );
    if (exists) {
      res
        .status(409)
        .send({ error: 'Shopping list with the same name already exists' });
      return;
    }

    const createdShoppingList =
      await this.shoppingListsRepository.createShoppingList(validatedData);
    if (!createdShoppingList) {
      res.status(400).send({ error: 'Error creating shopping list' });
      return;
    }

    await this.handleItemsAssociation(
      validatedData.items || [],
      createdShoppingList.id,
    );

    res.status(201).send(createdShoppingList);
  }

  // Delete shopping list by ID
  async deleteShoppingList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const result = await this.shoppingListsRepository.deleteShoppingList(id);
    if (result === 0) {
      res.status(404).send({ error: 'Shopping list not found' });
      return;
    }

    res.status(204).send();
  }

  // Update shopping list by ID
  async updateShoppingList(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    let validatedData;
    try {
      validatedData = updateShoppingListZodSchema.parse(req.body);
    } catch (error: unknown) {
      console.error(error);
      res.status(400).send({ error: 'Invalid data' });
      return;
    }

    const updatedShoppingList =
      await this.shoppingListsRepository.updateShoppingList(id, validatedData);

    if (!updatedShoppingList) {
      res.status(404).send({ error: 'Shopping list not found' });
      return;
    }

    res.status(200).send(updatedShoppingList);
  }

  // Associate items with shopping list
  async associateItemsWithShoppingList(
    req: Request,
    res: Response,
  ): Promise<void> {
    if (!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    let validatedData = null;
    try {
      validatedData = associateItemsWithShoppingListSchema.parse(req.body);
    } catch {
      res.status(400).send({ error: 'Invalid data' });
      return;
    }

    const { items } = validatedData;
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

    const result =
      await this.shoppingListsRepository.associateItemsWithShoppingList(
        req.params.id,
        items,
      );
    if (result === null) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }

    res.status(200).send('Items added to shopping list');
  }

  // Remove item from shopping list
  async removeItemFromShoppingList(req: Request, res: Response): Promise<void> {
    const { id, itemId } = req.params;
    if (!isUUID(id) || !isUUID(itemId)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const result =
      await this.shoppingListsRepository.removeItemFromShoppingList(id, itemId);
    if (!result) {
      res.status(404).send({ error: 'Item or shopping list not found' });
      return;
    }

    res.status(204).send();
  }

  // Update shopping list items
  async updateShoppingListItems(req: Request, res: Response): Promise<void> {
    const { id, itemId } = req.params;
    if (!isUUID(id) || !isUUID(itemId)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const { quantity, isPurchased } = req.body;
    const result = await this.shoppingListsRepository.updateShoppingListItems(
      id,
      itemId,
      quantity,
      isPurchased,
    );
    if (!result) {
      res.status(400).send({ error: 'Quantity must be greater than 0' });
      return;
    }

    res.status(200).send();
  }

  // Get items from shopping list
  async getShoppingListItems(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const items = await this.shoppingListsRepository.getShoppingListItems(id);
    if (!items) {
      res.status(404).send({ error: 'Shopping list not found' });
      return;
    }

    res.status(200).send(items);
  }

  // Search shopping lists
  async searchShoppingLists(req: Request, res: Response): Promise<void> {
    const { query } = req.query;
    if (typeof query !== 'string') {
      res
        .status(400)
        .send({ error: 'Query parameter is required and must be a string' });
      return;
    } else if (query.trim() === '') {
      // Check if query is empty and return an empty array
      res.status(200).send([]);
      return;
    }

    const results =
      await this.shoppingListsRepository.searchShoppingLists(query);
    res.status(200).send(results);
  }

  // Search shopping lists by item
  async searchShoppingListsByItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    if (!(await this.itemsRepository.getItemById(id))) {
      res.status(404).send({ error: 'Item not found' });
      return;
    }

    const results =
      await this.shoppingListsRepository.searchShoppingListsByItem(id);
    if (results.length === 0) {
      res.status(404).send({ error: 'No shopping lists found for this item' });
      return;
    }

    res.status(200).send(results);
  }

  // Get store associated with shopping list
  async getShoppingListStore(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const store = await this.shoppingListsRepository.getShoppingListStore(id);
    if (!store) {
      res.status(404).send({ error: 'Shopping list not found' });
      return;
    }

    res.status(200).send(store);
  }

  // Set store for shopping list
  async setShoppingListStore(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const { store } = req.body;
    const result = await this.shoppingListsRepository.setShoppingListStore(
      id,
      store,
    );
    if (!result) {
      res.status(404).send({ error: 'Shopping list not found' });
      return;
    }

    res.status(200).send();
  }

  // Get shopping lists by store
  async getShoppingListsByStore(req: Request, res: Response): Promise<void> {
    const { store } = req.query;
    if (typeof store !== 'string') {
      res.status(400).send({
        error: 'Store query parameter is required and must be a string',
      });
      return;
    } else if (store.trim() === '') {
      // Check if store is empty and return an empty array
      res.status(200).send([]);
      return;
    }

    const results =
      await this.shoppingListsRepository.getShoppingListsByStore(store);
    res.status(200).send(results);
  }

  // Lookup product by barcode
  async lookupProductByBarcode(req: Request, res: Response): Promise<void> {
    const { barcode } = req.query;
    if (typeof barcode !== 'string') {
      res.status(400).send({
        error: 'Barcode query parameter is required and must be a string',
      });
      return;
    }

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      );
      const data = await response.json();

      if (data.status === 1) {
        res.status(200).send(data.product);
      } else {
        res.status(404).send({ error: 'Product not found' });
      }
    } catch {
      res.status(500).send({ error: 'Internal server error' });
    }
  }

  // Handle items association with shopping list
  private async handleItemsAssociation(
    items: {
      id?: string;
      name?: string;
      description?: string;
      quantity?: number;
    }[],
    shoppingListId: string,
  ): Promise<void> {
    const itemsWithName: {
      name: string;
      description?: string;
      quantity?: number;
    }[] = [];
    const itemsWithId: { id: string; quantity?: number }[] = [];

    if (items) {
      for (const item of items) {
        if (item.id) {
          itemsWithId.push({ id: item.id, quantity: item.quantity });
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
        shoppingListId,
        items.map((item, index) => ({
          itemId: item.id,
          quantity: itemsWithId[index].quantity,
        })),
      );
    }
  }
}