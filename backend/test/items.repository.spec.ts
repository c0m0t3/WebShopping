import { TestDatabase } from './helpers/database';
import { ItemsRepository } from '../src/database/repository/items.repository';

jest.setTimeout(10000);

describe('ItemsRepository Integration Tests', () => {
  const testDatabase = new TestDatabase();
  let repository: ItemsRepository;

  beforeAll(async () => {
    await testDatabase.setup();
    repository = new ItemsRepository(testDatabase.database);

    // Insert test data into the items table using createItems method
    await repository.createItems([
      { name: 'Test Item 1', description: 'Description for Test Item 1' },
      { name: 'Test Item 2', description: 'Description for Test Item 2' },
    ]);
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  describe('getItemById', () => {
    it('should return an item by ID', async () => {
      const test_id = (await repository.getItems())[0].id;
      const item = await repository.getItemById(test_id);
      expect(item).toEqual({
        id: test_id,
        name: 'Test Item 1',
        description: 'Description for Test Item 1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return null if the item does not exist', async () => {
      const item = await repository.getItemById(
        'cc2e9609-4d06-42e5-bc2a-1a81789740b7',
      );
      expect(item).toBeNull();
    });
  });

  describe('getItems', () => {
    it('should return all items', async () => {
      const items = await repository.getItems();
      expect(items.length).toBe(2);
      expect(items).toEqual([
        {
          id: expect.any(String),
          name: 'Test Item 1',
          description: 'Description for Test Item 1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          name: 'Test Item 2',
          description: 'Description for Test Item 2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });
  });

  describe('createItems', () => {
    it('should create new items', async () => {
      const newItems = [
        { name: 'Test Item 3', description: 'Description for Test Item 3' },
        { name: 'Test Item 4', description: 'Description for Test Item 4' },
      ];
      const createdItems = await repository.createItems(newItems);
      expect(createdItems.length).toBe(2);
      expect(createdItems).toEqual([
        {
          id: expect.any(String),
          name: 'Test Item 3',
          description: 'Description for Test Item 3',
        },
        {
          id: expect.any(String),
          name: 'Test Item 4',
          description: 'Description for Test Item 4',
        },
      ]);
    });

    it('should not create items that already exist', async () => {
      const newItems = [
        { name: 'Test Item 1', description: 'Description for Test Item 1' },
      ];
      const createdItems = await repository.createItems(newItems);
      expect(createdItems.length).toBe(0);
    });

    it('should throw an error when creating items with empty names', async () => {
      const newItems = [
        { name: '', description: 'Description for Test Item with empty name' },
      ];
      await expect(repository.createItems(newItems)).rejects.toThrow(
        'Item name can not be empty',
      );
    });

    it('should throw an error if fields are empty', async () => {
      const newItems = [{ name: '', description: '' }];
      await expect(repository.createItems(newItems)).rejects.toThrow(
        'Item name can not be empty',
      );
    });

  });

  describe('deleteItemFromDatabase', () => {
    it('should delete an item by ID', async () => {
      const test_id = (await repository.getItems())[0].id;
      const deletedItem = await repository.deleteItemFromDatabase(test_id);
      expect(deletedItem).toBeTruthy();
      const item = await repository.getItemById(test_id);
      expect(item).toBeNull();
    });

    it('should return null if the item does not exist', async () => {
      const deletedItem = await repository.deleteItemFromDatabase(
        'cc2e9609-4d06-42e5-bc2a-1a81789740b7',
      );
      expect(deletedItem).toBeNull();
    });
  });

  describe('updateItem', () => {
    it('should update an item by ID', async () => {
      const test_id = (await repository.getItems())[0].id;
      const updatedItem = await repository.updateItem(test_id, {
        name: 'Updated Test Item 1',
        description: 'Updated Description for Test Item 1',
      });
      expect(updatedItem).toEqual([
        {
          id: test_id,
          name: 'Updated Test Item 1',
          description: 'Updated Description for Test Item 1',
        },
      ]);
    });

    it('should return null if the item does not exist', async () => {
      const updatedItem = await repository.updateItem(
        'cc2e9609-4d06-42e5-bc2a-1a81789740b7',
        {
          name: 'Updated Test Item',
          description: 'Updated Description for Test Item',
        },
      );
      expect(updatedItem).toBeNull();
    });

    it('should throw an error if fields are empty', async () => {
      const test_id = (await repository.getItems())[0].id;
      await expect(
        repository.updateItem(test_id, { name: '', description: '' }),
      ).rejects.toThrow('Item name cannot be empty');
    });

  });
});
