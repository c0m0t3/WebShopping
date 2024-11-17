import express, { Application } from 'express';
import request from 'supertest';
import { ShoppingListsController } from '../src/controller/shoppingLists.controller';
import { ShoppingListsRepository } from '../src/database/repository/shoppingLists.repository';
import { ItemsRepository } from '../src/database/repository/items.repository';
import { TestDatabase } from './helpers/database';
import { HealthController } from '../src/controller/health.controller';

jest.setTimeout(10000); // Increase the timeout to 10 seconds.

describe('ShoppingListsController', () => {
  let app: Application;
  let testDatabase: TestDatabase;
  let shoppingListsRepository: ShoppingListsRepository;
  let itemsRepository: ItemsRepository;

  beforeAll(async () => {
    testDatabase = new TestDatabase();
    await testDatabase.setup();
    shoppingListsRepository = new ShoppingListsRepository(testDatabase.database);
    itemsRepository = new ItemsRepository(testDatabase.database);
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    const shoppingListsController = new ShoppingListsController(shoppingListsRepository, itemsRepository);
    const healthController = new HealthController();
    app.get('/shoppingLists/:id', shoppingListsController.getShoppingListById.bind(shoppingListsController));
    app.get('/shoppingLists', shoppingListsController.getShoppingLists.bind(shoppingListsController));
    app.post('/shoppingLists', shoppingListsController.createShoppingList.bind(shoppingListsController));
    app.delete('/shoppingLists/:id', shoppingListsController.deleteShoppingList.bind(shoppingListsController));
    app.put('/shoppingLists/:id', shoppingListsController.updateShoppingList.bind(shoppingListsController));
    app.post('/shoppingLists/:id/items', shoppingListsController.associateItemsWithShoppingList.bind(shoppingListsController));
    app.delete('/shoppingLists/:id/items/:itemId', shoppingListsController.removeItemFromShoppingList.bind(shoppingListsController));
    app.get('/shoppingLists/:id/items', shoppingListsController.getShoppingListItems.bind(shoppingListsController));
    app.put('/shoppingLists/:id/items/:itemId', shoppingListsController.updateShoppingListItems.bind(shoppingListsController));
    app.get('/shoppingLists/search/search', shoppingListsController.searchShoppingLists.bind(shoppingListsController));
    app.get('/shoppingLists/search/:id', shoppingListsController.searchShoppingListsByItem.bind(shoppingListsController));
    app.get('/health', healthController.getHealthStatus.bind(healthController));

    // Insert test data into the shopping lists table
    await shoppingListsRepository.clear();
    await shoppingListsRepository.createShoppingList({ name: 'Test Shopping List 1' });
    await shoppingListsRepository.createShoppingList({ name: 'Test Shopping List 2' });
    await itemsRepository.createItems([{ name: 'Test Item 1', description: "" }]);

    const shoppingLists = await shoppingListsRepository.getShoppingLists();
    const items = await itemsRepository.getItems();

    await shoppingListsRepository.associateItemsWithShoppingList(shoppingLists[0].id, [{ itemId: items[0].id, quantity: 1 }]); });

  describe('GET /health', () => {
    it('should return a health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /shoppingLists', () => {
    it('should return a list of shopping lists', async () => {
      const response = await request(app).get('/shoppingLists');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: expect.any(String),
          name: 'Test Shopping List 1',
          description: "",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(String),
          name: 'Test Shopping List 2',
          description: "",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('GET /shoppingLists/:id', () => {
    it('should return a shopping list by ID', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;

      const response = await request(app).get(`/shoppingLists/${shoppingListId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: shoppingListId,
        name: 'Test Shopping List 1',
        description: "",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
    it('should return a 404 if the shopping list does not exist', async () => {
      const response = await request(app).get('/shoppingLists/1bcbecc6-8c96-4263-9579-1abb79b517bb');
      expect(response.status).toBe(404);
    });
    it('should return a 400 if the ID is not a valid UUID', async () => {
      const response = await request(app).get('/shoppingLists/invalid-uuid');
      expect(response.status).toBe(400);
    });
  });

  describe('POST /shoppingLists', () => {
    it('should create a new shopping list', async () => {
      const response = await request(app)
        .post('/shoppingLists')
        .send({ name: 'Test Shopping List 3' });
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'Test Shopping List 3',
        description: "",
      });
    });
  });

  describe('DELETE /shoppingLists/:id', () => {
    it('should delete a shopping list by ID', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;

      const response = await request(app).delete(`/shoppingLists/${shoppingListId}`);
      expect(response.status).toBe(204);
    });
    it('should return a 404 if the shopping list does not exist', async () => {
      const response = await request(app).delete('/shoppingLists/1bcbecc6-8c96-4263-9579-1abb79b517bb');
      expect(response.status).toBe(404);
    });
    it('should return a 400 if the ID is not a valid UUID', async () => {
      const response = await request(app).delete('/shoppingLists/invalid-uuid');
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /shoppingLists/:id', () => {
    it('should update a shopping list by ID', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;

      const response = await request(app)
        .put(`/shoppingLists/${shoppingListId}`)
        .send({ name: 'Test Shopping List 1 Updated' });
      expect(response.status).toBe(200);
    });
    it('should return a 404 if the shopping list does not exist', async () => {
      const response = await request(app)
        .put('/shoppingLists/1bcbecc6-8c96-4263-9579-1abb79b517bb')
        .send({ name: 'Test Shopping List 1 Updated' });
      expect(response.status).toBe(404);
    });
    it('should return a 400 if the ID is not a valid UUID', async () => {
      const response = await request(app)
        .put('/shoppingLists/invalid-uuid')
        .send({ name: 'Test Shopping List 1 Updated' });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /shoppingLists/:id/items', () => {
    it('should associate items with a shopping list', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;
      const items = await itemsRepository.getItems();
      const itemId = items[0].id;

      const response = await request(app)
        .post(`/shoppingLists/${shoppingListId}/items`)
        .send({ items: [{ itemId: itemId, quantity: 1 }] });
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /shoppingLists/:id/items/:itemId', () => {
    it('should remove an item from a shopping list', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;
      const items = await itemsRepository.getItems();

      const response = await request(app).delete(`/shoppingLists/${shoppingListId}/items/${items[0].id}`);
      expect(response.status).toBe(204);
    });
  });

  describe('GET /shoppingLists/:id/items', () => {
    it('should return items of a shopping list', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;

      const response = await request(app).get(`/shoppingLists/${shoppingListId}/items`);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /shoppingLists/:id/items/:itemId', () => {
    it('should update items of a shopping list', async () => {
      const shoppingLists = await shoppingListsRepository.getShoppingLists();
      const shoppingListId = shoppingLists[0].id;

      const response = await request(app)
        .put(`/shoppingLists/${shoppingListId}/items/1bcbecc6-8c96-4263-9579-1abb79b517bb`)
        .send({ quantity: 2 });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /shoppingLists/search/search', () => {
    it('should search shopping lists', async () => {
      const response = await request(app).get('/shoppingLists/search/search?query=Test');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /shoppingLists/search/:id', () => {
    it('should search shopping lists by item', async () => {
      const response = await request(app).get('/shoppingLists/search/1bcbecc6-8c96-4263-9579-1abb79b517bb');
      expect(response.status).toBe(200);
    });
  });
});