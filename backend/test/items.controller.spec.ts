import express, { Application } from 'express';
import request from 'supertest';
import { ItemsController } from '../src/controller/items.controller';
import { ItemsRepository } from '../src/database/repository/items.repository';
import { TestDatabase } from './helpers/database';
import { HealthController } from '../src/controller/health.controller';

jest.setTimeout(10000); // Increase the timeout to 10 seconds.

describe('ItemsController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let itemsRepository: ItemsRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    itemsRepository = new ItemsRepository(testDatabase.database);
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    const itemsController = new ItemsController(itemsRepository);
    const healthController = new HealthController();
    app.get('/items', itemsController.getItems.bind(itemsController));
    app.get('/items/:id', itemsController.getItemById.bind(itemsController));
    app.get('/health', healthController.getHealthStatus.bind(healthController));

    // Insert test data into the items table
    await itemsRepository.createItems([
      { name: 'Test Item 1', description: 'Description for Test Item 1' },
      { name: 'Test Item 2', description: 'Description for Test Item 2' },
    ]);
  });

  describe('GET /health', () => {
    it('should return a health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /items', () => {
    it('should return a list of items', async () => {
      const response = await request(app).get('/items');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: expect.any(String),
          name: 'Test Item 1',
          description: 'Description for Test Item 1',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(String),
          name: 'Test Item 2',
          description: 'Description for Test Item 2',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('GET /items/:id', () => {
    it('should return an item by ID', async () => {
      const items = await itemsRepository.getItems();
      const itemId = items[0].id;

      const response = await request(app).get(`/items/${itemId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: itemId,
        name: 'Test Item 1',
        description: 'Description for Test Item 1',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});