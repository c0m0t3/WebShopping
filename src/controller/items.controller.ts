import { Request, Response } from 'express';
import { ItemsRepository } from '../database/repository/items.repository';

export class ItemController {
  constructor(private readonly itemRepository: ItemsRepository) {}

}