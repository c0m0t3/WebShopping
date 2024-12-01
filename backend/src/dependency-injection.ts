import { App } from './app';
import { ENV } from './config/env.config';
import { Database, db } from './database';
import { Server } from './server';
import { HealthController } from './controller/health.controller';
import { Routes } from './routes/routes';
import { ItemsRepository } from './database/repository/items.repository';
import { ItemsController } from './controller/items.controller';
import { ShoppingListsRepository } from './database/repository/shoppingLists.repository';
import { ShoppingListsController } from './controller/shoppingLists.controller';

export const DI = {} as {
  app: App;
  db: Database;
  server: Server;
  routes: Routes;
  repositories: {
    items: ItemsRepository;
    shoppingLists: ShoppingListsRepository;
  };
  controllers: {
    health: HealthController;
    items: ItemsController;
    shoppingLists: ShoppingListsController;
  };
};

export function initializeDependencyInjection(): void {
  process.env.DATABASE_URL = ENV.DATABASE_URL;

  // Initialize database
  DI.db = db;

  DI.repositories = {
    items: new ItemsRepository(DI.db),
    shoppingLists: new ShoppingListsRepository(DI.db),
  };

  DI.controllers = {
    health: new HealthController(),
    items: new ItemsController(DI.repositories.items),
    shoppingLists: new ShoppingListsController(
      DI.repositories.shoppingLists,
      DI.repositories.items,
    ),
  };

  // Initialize appRoutes
  DI.routes = new Routes(
    DI.controllers.health,
    DI.controllers.items,
    DI.controllers.shoppingLists,
  );

  // Initialize app
  DI.app = new App(DI.routes);
  DI.server = new Server(DI.app, ENV);
}
