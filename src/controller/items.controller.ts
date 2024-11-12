import { Request, Response } from 'express';
import { ItemsRepository } from '../database/repository/items.repository';

export class ItemsController {
  constructor(private readonly itemRepository: ItemsRepository) {}

  async getItemById(req: Request, res: Response): Promise<void> {
    const item = await this.itemRepository.getItemById(req.params.id);
    if (!item) {
      res.status(404).send('Item not found');
      return;
    }
    res.status(200).send(item);
  }

  async createItem(req: Request, res: Response): Promise<void> {
    const createdItem = await this.itemRepository.createItem(req.body);
    res.status(201).send(createdItem);
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    await this.itemRepository.deleteItemFromDatabase(req.params.id);
    res.status(204).send();
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const updatedItem = await this.itemRepository.updateItem(
      req.params.id,
      req.body,
    );
    res.status(200).send(updatedItem);
  }
}
