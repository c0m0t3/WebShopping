import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { HealthController } from '../controller/health.controller';
import { ItemsController } from '../controller/items.controller';

//todo hier kommen die Controller der Klassen hin

export class Routes {
  private router: Router;

  constructor(
    private readonly authController: AuthController, //todo hier auch die anderen Controller hinzufügen
    private readonly healthController: HealthController,
    private readonly itemsController: ItemsController,
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
      this.itemsController.getItemById.bind(this.itemsController),
    );
    this.router.post(
      '/items',
      this.itemsController.createItem.bind(this.itemsController),
    );
    this.router.delete(
      '/items/:id',
      this.itemsController.deleteItem.bind(this.itemsController),
    );
    this.router.put(
      '/items/:id',
      this.itemsController.updateItem.bind(this.itemsController),
    );
  }
}
