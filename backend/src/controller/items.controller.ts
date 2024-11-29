import { Request, Response } from 'express';
import { ItemsRepository } from '../database/repository/items.repository';
import { validate as isUUID } from 'uuid';

export class ItemsController {
  constructor(private readonly itemRepository: ItemsRepository) {}

  async getItemById(req: Request, res: Response): Promise<void> {
    if (!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const item = await this.itemRepository.getItemById(req.params.id);
    if (!item) {
      res.status(404).send('Item not found');
      return;
    }
    res.status(200).send(item);
  }

  async getItems(req: Request, res: Response): Promise<void> {
    const items = await this.itemRepository.getItems();
    res.status(200).send(items);
  }

  async createItems(req: Request, res: Response): Promise<void> {
    try {
      const createdItems = await this.itemRepository.createItems(req.body);
      if (createdItems.length === 0) {
        res
          .status(409)
          .send('No new items were created because they already exist.');
      } else {
        res.status(201).send(createdItems);
      }
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Item name can not be empty') {
        res.status(400).send({ error: err.message });
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    if (!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    try {
      const result = await this.itemRepository.deleteItemFromDatabase(
        req.params.id,
      );
      if (!result) {
        res.status(404).send('Item not found');
        return;
      }
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Item is associated with a shopping list') {
        res
          .status(409)
          .send({ error: 'Item is associated with a shopping list' });
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    if (!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    try {
      const updatedItem = await this.itemRepository.updateItem(
        req.params.id,
        req.body,
      );
      if (!updatedItem) {
        res.status(404).send('Item not found');
        return;
      }
      res.status(200).send(updatedItem);
    } catch (error) {
      const err = error as Error;
      if (err.message === 'An item with the same name already exists') {
        res.status(409).send({ error: err.message });
      } else if (err.message === 'Item name cannot be empty') {
        res.status(400).send({ error: err.message });
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }
}
