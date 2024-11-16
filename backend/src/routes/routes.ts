import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { HealthController } from '../controller/health.controller';
import { ItemsController } from '../controller/items.controller';
import { ShoppingListsController } from '../controller/shoppingLists.controller';
import { associateItemsWithShoppingListSchema } from '../validation/validation';
import { validateUUID } from '../middleware/validateUUID';
import { globalErrorHandler } from '../utils/global-error';

//todo hier kommen die Controller der Klassen hin

export class Routes {
  private router: Router;

  constructor(
    private readonly authController: AuthController, //todo hier auch die anderen Controller hinzufügen
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
    this.router.post(
      '/auth/register',
      this.authController.registerUser.bind(this.authController),
    );
    this.router.post(
      '/auth/login',
      this.authController.loginUser.bind(this.authController),
    );
    // Health routes
    this.router.get(
      '/health',
      this.healthController.getHealthStatus.bind(this.healthController),
    );
    // Items routes
    this.router.get(
      '/items/:id',
      validateUUID,
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
      validateUUID,
      this.itemsController.deleteItem.bind(this.itemsController),
    );
    this.router.put(
      '/items/:id',
      validateUUID,
      this.itemsController.updateItem.bind(this.itemsController),
    );
    // ShoppingLists routes
    this.router.get(
      '/shoppingLists/:id',
      validateUUID,
      this.ShoppingListsController.getShoppingListById.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.get(
      '/shoppingLists',
      this.ShoppingListsController.getShoppingLists.bind(
        this.ShoppingListsController,
      ),
    )
    this.router.post(
      '/shoppingLists',
      this.ShoppingListsController.createShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.delete(
      '/shoppingLists/:id',
      validateUUID,
      this.ShoppingListsController.deleteShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.put(
      '/shoppingLists/:id',
      validateUUID,
      this.ShoppingListsController.updateShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
  // ShoppingLists items routes
    this.router.post(
      '/shoppingLists/:id/items', //TODO es muss noch geprüft werden ob die Items existieren
      validateUUID,
      (req, res, next) => {
        try {
          associateItemsWithShoppingListSchema.parse(req.body);
          next();
        } catch (e) {
          next(e); //
        }
      },
      this.ShoppingListsController.associateItemsWithShoppingList.bind(
        this.ShoppingListsController,
      ),
    );
    this.router.use(globalErrorHandler);

    this.router.delete(
      '/shoppingLists/:id/items/:itemId',
      validateUUID,
      this.ShoppingListsController.removeItemFromShoppingList.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.get(
      '/shoppingLists/:id/items',
      validateUUID,
      this.ShoppingListsController.getShoppingListItems.bind(
        this.ShoppingListsController,
      ),
    );

    this.router.put(
      '/shoppingLists/:id/items/:itemId',
      validateUUID,
      this.ShoppingListsController.updateShoppingListItems.bind(
        this.ShoppingListsController,
      ),
    )

    // Special Routes
    this.router.get(
      '/shoppingLists/search/search',
      this.ShoppingListsController.searchShoppingLists.bind(
        this.ShoppingListsController,
      ),
    )
    this.router.get(
      '/shoppingLists/search/:id',
      validateUUID,
      this.ShoppingListsController.searchShoppingListsByItem.bind(
        this.ShoppingListsController,
      ),
    )
  }
}
