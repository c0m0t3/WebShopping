import { Request, Response } from 'express';
import { ItemsRepository } from '../database/repository/items.repository';
import { validate as isUUID } from 'uuid';

export class ItemsController {
  constructor(private readonly itemRepository: ItemsRepository) {}

  async getItemById(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
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
    const createdItems = await this.itemRepository.createItems(req.body);
    if (createdItems.length === 0) {
      res.status(409).send('No new items were created because they already exist.');
    } else {
      res.status(201).send(createdItems);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const result = await this.itemRepository.deleteItemFromDatabase(req.params.id);
    if (!result) {
      res.status(404).send('Item not found');
      return;
    }
    res.status(204).send();
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    if(!isUUID(req.params.id)) {
      res.status(400).send({ error: 'Invalid UUID' });
      return;
    }
    const updatedItem = await this.itemRepository.updateItem(
      req.params.id,
      req.body,
    );
    if(!updatedItem) {
      res.status(404).send('Item not found');
      return;
    }
    res.status(200).send(updatedItem);
  }
}
