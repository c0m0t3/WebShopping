import { Request, Response } from 'express';
import { ItemsRepository } from '../database/repository/items.repository';
import { validate as isUUID } from 'uuid';

export class ItemsController {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  // Get item by ID
  async getItemById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    const item = await this.itemsRepository.getItemById(id);
    if (!item) {
      res.status(404).send({ error: 'Item not found' });
      return;
    }

    res.status(200).send(item);
  }

  // Get all items
  async getItems(req: Request, res: Response): Promise<void> {
    const items = await this.itemsRepository.getItems();
    res.status(200).send(items);
  }

  // Create new items
  async createItems(req: Request, res: Response): Promise<void> {
    try {
      const createdItems = await this.itemsRepository.createItems(req.body);
      if (createdItems.length === 0) {
        res.status(409).send({
          error: 'No new items were created because they already exist.',
        });
      } else {
        res.status(201).send(createdItems);
      }
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  // Delete item by ID
  async deleteItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    try {
      const result = await this.itemsRepository.deleteItemFromDatabase(id);
      if (!result) {
        res.status(404).send({ error: 'Item not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  // Update item by ID
  async updateItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!isUUID(id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }

    try {
      const updatedItem = await this.itemsRepository.updateItem(id, req.body);
      if (!updatedItem) {
        res.status(404).send({ error: 'Item not found' });
        return;
      }
      res.status(200).send(updatedItem);
    } catch (error) {
      this.handleError(res, error as Error);
    }
  }

  // Handle errors
  private handleError(res: Response, error: Error): void {
    if (error.message === 'Item name cannot be empty') {
      res.status(400).send({ error: error.message });
    } else if (error.message === 'An item with the same name already exists') {
      res.status(409).send({ error: error.message });
    } else if (error.message === 'Item is associated with a shopping list') {
      res.status(409).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
