import { Router } from 'express';
import { HealthController } from '../controller/health.controller';
import { ItemsController } from '../controller/items.controller';
import { ShoppingListsController } from '../controller/shoppingLists.controller';

//todo hier kommen die Controller der Klassen hin

export class Routes {
  private router: Router;

  constructor(
    //todo hier auch die anderen Controller hinzufügen
    private readonly healthController: HealthController,
    private readonly itemsController: ItemsController,
    private readonly ShoppingListsController: ShoppingListsController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes() {
    // Health appRoutes
    this.router.get(
      '/health',
      this.healthController.getHealthStatus.bind(this.healthController),
    );
    // Items appRoutes
    this.router.get(
      '/items/:id',
      this.itemsController.getItemById.bind(this.itemsController),
    );
    this.router.get(
      '/items',
      this.itemsController.getItems.bind(this.itemsController),
    );
    this.router.post(
      '/items',
      this.itemsController.createItems.bind(this.itemsController),
    );
    this.router.delete(
      '/items/:id',
      this.itemsController.deleteItem.bind(this.itemsController),
    );
    this.router.put(
      '/items/:id',
      this.itemsController.updateItem.bind(this.itemsController),
    );
    // ShoppingLists appRoutes
    this.router.get(
      '/shoppingLists/:id',
      this.ShoppingListsController.getShoppingListById.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.get(
      '/shoppingLists',
      this.ShoppingListsController.getShoppingLists.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.post(
      '/shoppingLists',
      this.ShoppingListsController.createShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.delete(
      '/shoppingLists/:id',
      this.ShoppingListsController.deleteShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.put(
      '/shoppingLists/:id',
      this.ShoppingListsController.updateShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
    // ShoppingLists items appRoutes
    this.router.post(
      '/shoppingLists/:id/items',
      this.ShoppingListsController.associateItemsWithShoppingList.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.delete(
      '/shoppingLists/:id/items/:itemId',
      this.ShoppingListsController.removeItemFromShoppingList.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.get(
      '/shoppingLists/:id/items',
      this.ShoppingListsController.getShoppingListItems.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.put(
      '/shoppingLists/:id/items/:itemId',
      this.ShoppingListsController.updateShoppingListItems.bind(
        this.ShoppingListsController,
      ),
    );

    // Special Routes
    this.router.get(
      '/shoppingLists/search/search',
      this.ShoppingListsController.searchShoppingLists.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.get(
      '/shoppingLists/search/:id',
      this.ShoppingListsController.searchShoppingListsByItem.bind(
        this.ShoppingListsController,
      ),
    );
    //Store Routes
    this.router.get(
      '/shoppingLists/store/store',
      this.ShoppingListsController.getShoppingListsByStore.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.get(
      '/shoppingLists/:id/store',
      this.ShoppingListsController.getShoppingListStore.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.put(
      '/shoppingLists/:id/store',
      this.ShoppingListsController.setShoppingListStore.bind(
        this.ShoppingListsController,
      ),
    );

    // Barcode
    this.router.get(
      '/products/lookup',
      this.ShoppingListsController.lookupProductByBarcode.bind(
        this.ShoppingListsController,
      ),
    );
  }
}
