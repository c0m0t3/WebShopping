import express, { Application } from 'express';
import request from 'supertest';
import { ItemsController } from '../src/controller/items.controller';
import { ItemsRepository } from '../src/database/repository/items.repository';
import { TestDatabase } from './helpers/database';
import { HealthController } from '../src/controller/health.controller';

jest.setTimeout(60000); // Increase the timeout to 10 seconds.

describe('ItemsController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let itemsRepository: ItemsRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    itemsRepository = new ItemsRepository(testDatabase.database);
  }, 60000);

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
    app.post('/items', itemsController.createItems.bind(itemsController));
    app.delete('/items/:id', itemsController.deleteItem.bind(itemsController));
    app.put('/items/:id', itemsController.updateItem.bind(itemsController));

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
    it('should return a 404 if the item does not exist', async () => {
      const response = await request(app).get(
        '/items/1bcbecc6-8c96-4263-9579-1abb79b517bb',
      );
      expect(response.status).toBe(404);
    });
    it('should return a 400 if the ID is not a valid UUID', async () => {
      const response = await request(app).get('/items/invalid-uuid');
      expect(response.status).toBe(400);
    });
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post('/items')
        .send([
          { name: 'Test Item 3', description: 'Description for Test Item 3' },
        ]);
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          id: expect.any(String),
          name: 'Test Item 3',
          description: 'Description for Test Item 3',
        },
      ]);
    });
    it('should return a 409 if the item already exists', async () => {
      const response = await request(app)
        .post('/items')
        .send([
          { name: 'Test Item 1', description: 'Description for Test Item 1' },
        ]);
      expect(response.status).toBe(409);
    });
    it('should return a 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/items')
        .send([{ description: 'Description without name' }]);
      expect(response.status).toBe(400);
    });

    it('should return a 400 if fields are empty', async () => {
      const response = await request(app)
        .post('/items')
        .send([{ name: '', description: '' }]);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an item by ID', async () => {
      const items = await itemsRepository.getItems();
      const itemId = items[0].id;

      const response = await request(app).delete(`/items/${itemId}`);
      expect(response.status).toBe(204);
    });
    it('should return a 404 if the item does not exist', async () => {
      const response = await request(app).delete(
        '/items/1bcbecc6-8c96-4263-9579-1abb79b517bb',
      );
      expect(response.status).toBe(404);
    });
    it('should return a 400 if the ID is not a valid UUID', async () => {
      const response = await request(app).delete('/items/invalid-uuid');
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /items/:id', () => {
    it('should update an item by ID', async () => {
      const items = await itemsRepository.getItems();
      const itemId = items[0].id;

      const response = await request(app).put(`/items/${itemId}`).send({
        name: 'Test Item 1 Updated',
        description: 'Description for Test Item 1 Updated',
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: itemId,
          name: 'Test Item 1 Updated',
          description: 'Description for Test Item 1 Updated',
        },
      ]);
    });
    it('should return a 404 if the item does not exist', async () => {
      const response = await request(app)
        .put('/items/1bcbecc6-8c96-4263-9579-1abb79b517bb')
        .send({
          name: 'Test Item 1 Updated',
          description: 'Description for Test Item 1 Updated',
        });
      expect(response.status).toBe(404);
    });
    it('should return a 400 if the ID is not a valid UUID', async () => {
      const response = await request(app).put('/items/invalid-uuid').send({
        name: 'Test Item 1 Updated',
        description: 'Description for Test Item 1 Updated',
      });
      expect(response.status).toBe(400);
    });
    it('should return 409 if the name is already taken', async () => {
      const items = await itemsRepository.getItems();
      const itemId = items[0].id;

      const response = await request(app).put(`/items/${itemId}`).send({
        name: 'Test Item 2',
        description: 'Description for Test Item 1 Updated',
      });
      expect(response.status).toBe(409);
    });
  });
});
