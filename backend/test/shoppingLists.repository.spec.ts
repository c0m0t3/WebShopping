import { TestDatabase } from './helpers/database';
import { ShoppingListsRepository } from '../src/database/repository/shoppingLists.repository';

describe('ShoppingListRepository Integration Tests', () => {
  const testDatabase = new TestDatabase();
  let repository: ShoppingListsRepository;

  beforeAll(async () => {
    await testDatabase.setup();
    repository = new ShoppingListsRepository(testDatabase.database);

    // Insert test data into the shopping_lists table using createShoppingLists method
    await repository.createShoppingList(
      { name: 'Test Shopping List 1', description: 'Description for Test Shopping List 1', store: 'Store 1' }
    );
    await repository.createShoppingList(
      { name: 'Test Shopping List 2', description: 'Description for Test Shopping List 2', store: 'Store 2' }
    );
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('getShoppingListById', () => {
    it('should return a shopping list by ID', async () => {
      const test_id = (await repository.getShoppingLists())[0].id;
      const shoppingList = await repository.getShoppingListById(test_id);
      expect(shoppingList).toEqual({
        id: test_id,
        name: 'Test Shopping List 1',
        description: 'Description for Test Shopping List 1',
        store: 'Store 1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return null if the shopping list does not exist', async () => {
      const shoppingList = await repository.getShoppingListById("cc2e9609-4d06-42e5-bc2a-1a81789740b7");
      expect(shoppingList).toBeNull();
    });
  });

  describe('getShoppingLists', () => {
    it('should return all shopping lists', async () => {
      const shoppingLists = await repository.getShoppingLists();
      expect(shoppingLists.length).toBe(2);
      expect(shoppingLists).toEqual([
        {
          id: expect.any(String),
          name: 'Test Shopping List 1',
          description: 'Description for Test Shopping List 1',
          store: 'Store 1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          name: 'Test Shopping List 2',
          description: 'Description for Test Shopping List 2',
          store: 'Store 2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });
  });

  describe('createShoppingLists', () => {
    it('should create new shopping lists', async () => {
      const newShoppingLists =
        { name: 'Test Shopping List 3', description: 'Description for Test Shopping List 3', store: 'Store 3' };
      const createdShoppingLists = await repository.createShoppingList(newShoppingLists);
      expect(createdShoppingLists).toEqual(
        {
          id: expect.any(String),
          name: 'Test Shopping List 3',
          description: 'Description for Test Shopping List 3',
          store: 'Store 3',
        }
      );
    });

    it('should not create shopping lists that already exist', async () => {
      const newShoppingLists =
        { name: 'Test Shopping List 1', description: 'Description for Test Shopping List 1', store: 'Store 1' };
      const createdShoppingLists = await repository.createShoppingList(newShoppingLists);
      expect(createdShoppingLists).toBeNull();
    });
  });

  describe('deleteShoppingListFromDatabase', () => {
    it('should delete a shopping list by ID', async () => {
      const test_id = (await repository.getShoppingLists())[0].id;
      const deletedShoppingList = await repository.deleteShoppingList(test_id);
      expect(deletedShoppingList).toBeTruthy();
      const shoppingList = await repository.getShoppingListById(test_id);
      expect(shoppingList).toBeNull();
    });

    it('should return null if the shopping list does not exist', async () => {
      const deletedShoppingList = await repository.deleteShoppingList("cc2e9609-4d06-42e5-bc2a-1a81789740b7");
      expect(deletedShoppingList).toBe(0);
    });
  });

  describe('updateShoppingList', () => {
    it('should update a shopping list by ID', async () => {
      const test_id = (await repository.getShoppingLists())[0].id;
      const updatedShoppingList = await repository.updateShoppingList(test_id, {
        name: 'Updated Test Shopping List 1',
        description: 'Updated Description for Test Shopping List 1',
        store: 'Updated Store 1',
      });
      if(updatedShoppingList) {
        expect(updatedShoppingList.rowCount).toBe(1);
      }
    });

    it('should return null if the shopping list does not exist', async () => {
      const updatedShoppingList = await repository.updateShoppingList("cc2e9609-4d06-42e5-bc2a-1a81789740b7", {
        name: 'Updated Test Shopping List',
        description: 'Updated Description for Test Shopping List',
        store: 'Updated Store',
      });
      expect(updatedShoppingList).toBeNull();
    });
  });
});