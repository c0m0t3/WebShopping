import { Request, Response } from 'express';
import { ShoppingListsRepository } from '../database/repository/shoppingLists.repository';
import { associateItemsWithShoppingListSchema, createShoppingListZodSchema } from '../validation/validation';
import { updateShoppingListZodSchema } from '../validation/validation';
import { ItemsRepository } from '../database/repository/items.repository';
import {validate as isUUID } from 'uuid';

export class ShoppingListsController {
  constructor(
    private readonly shoppingListsRepository: ShoppingListsRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  async getShoppingListById(req: Request, res: Response): Promise<void> {
    if (!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const shoppingList = await this.shoppingListsRepository.getShoppingListById(
      req.params.id,
    );
    if (!shoppingList) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }
    res.status(200).send(shoppingList);
  }

  async getShoppingLists(req: Request, res: Response): Promise<void> {
    console.log("getShoppingLists called");
    const shoppingLists = await this.shoppingListsRepository.getShoppingLists();
    res.status(200).send(shoppingLists);
  }

  // In ShoppingListsController
  async createShoppingList(req: Request, res: Response): Promise<void> {
    let validatedData = null;
    //TODO fix irgendwie
    //const validatedData = createShoppingListZodSchema.parse(req.body); //eigentlich richtiger weg aber jest sagt nein
    try {
       validatedData = createShoppingListZodSchema.parse(req.body);
    }
    catch (e) {
      console.log("error: ", e);
      res.status(400).send();
      return;
    }
    const exists = await this.shoppingListsRepository.shoppingListExistsByName(validatedData.name);
    if (exists) {
      res.status(409).send({ error: 'ShoppingList with the same name already exists' });
      return;
    }

    const createdShoppingList = await this.shoppingListsRepository.createShoppingList(validatedData);
    if (createdShoppingList === null) {
      res.status(400).send({ error: 'Error creating shopping list' });
      return;
    }

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
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id } = req.params;
    const result = await this.shoppingListsRepository.deleteShoppingList(id);

    if (result === 0) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }

    res.status(204).send();
  }

  async updateShoppingList(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
      const validatedData = updateShoppingListZodSchema.parse(req.body);
      const updatedShoppingList = await this.shoppingListsRepository.updateShoppingList(req.params.id, validatedData);

      if(updatedShoppingList === null) {
        res.status(404).send({ error: 'ShoppingList not found' });
        return;
      }
      res.status(200).send(updatedShoppingList);
  }

  async associateItemsWithShoppingList(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    //console.log(req.body);
    // const validatedData = associateItemsWithShoppingListSchema.parse(req.body); //TODO fix irgendwie
    let validatedData = null;
    try {
      validatedData = associateItemsWithShoppingListSchema.parse(req.body);
    } catch (e) {
      res.status(400).send();
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

    const result = await this.shoppingListsRepository.associateItemsWithShoppingList(req.params.id, items);
    if(result === null) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }
    res.status(200).send('Items added to shopping list');
  }

  async removeItemFromShoppingList(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id) || !isUUID(req.params.itemId)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id, itemId } = req.params;
    const result = await this.shoppingListsRepository.removeItemFromShoppingList(id, itemId);
    if (result === null) {
      res.status(404).send({ error: 'Item or Shopping List not found' });
      return
    }
    res.status(204).send();
  }

  async updateShoppingListItems(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id) || !isUUID(req.params.itemId)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id, itemId } = req.params;
    const { quantity, is_purchased } = req.body;
    const answer = await this.shoppingListsRepository.updateShoppingListItems(id, itemId, quantity, is_purchased);
    if(answer === null) {
      res.status(400).send('Quantity must be greater than 0');
      return;
    }
    res.status(200).send();
  }

  async getShoppingListItems(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id } = req.params;
    const items = await this.shoppingListsRepository.getShoppingListItems(id);
    if (items === null) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }
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
    if (!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id } = req.params;

    // Check if the item exists
    const itemExists = await this.itemsRepository.getItemById(id);
    if (!itemExists) {
      res.status(404).send({ error: 'Item not found' });
      return;
    }

    const results = await this.shoppingListsRepository.searchShoppingListsByItem(id);
    if (results.length === 0) {
      res.status(404).send({ error: 'No shopping lists found for this item' });
      return;
    }

    res.status(200).send(results);
  }

  async getShoppingListStore(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id } = req.params;
    const shoppingList = await this.shoppingListsRepository.getShoppingListStore(id);
    if (shoppingList === null) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }
    res.status(200).send(shoppingList);
  }

  async setShoppingListStore(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const { id } = req.params;
    const { store } = req.body;
    const result = await this.shoppingListsRepository.setShoppingListStore(id, store);
    if (result === null) {
      res.status(404).send({ error: 'ShoppingList not found' });
      return;
    }
    res.status(200).send();
  }

  async getShoppingListsByStore(req: Request, res: Response): Promise<void> {
    const { store } = req.query;
    if (typeof store !== 'string') {
      res.status(400).send({ error: 'Store query parameter is required and must be a string' });
      return;
    } else if(store.trim() === '') { // Check if store is empty and return an empty array
      res.status(200).send([]);
      return;
    }

    const results = await this.shoppingListsRepository.getShoppingListsByStore(store);
    res.send(results);
  }

  async lookupProductByBarcode(req: Request, res: Response): Promise<void> {
    const { barcode } = req.query;
    if (typeof barcode !== 'string') {
      res.status(400).send({ error: 'Barcode query parameter is required and must be a string' });
      return;
    }

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1) {
        res.status(200).send(data.product);
      } else {
        res.status(404).send({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
}
