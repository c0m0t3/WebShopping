import { App } from './app';
import { ENV } from './config/env.config';
import { Database, db } from './database';
import { Server } from './server';
import { Jwt } from './utils/jwt';
import { PasswordHasher } from './utils/password-hasher';
import { UserRepository } from './database/repository/user.repository';
import { AuthController } from './controller/auth.controller';
import { HealthController} from './controller/health.controller';
import { Routes } from './routes/routes';
import { ItemsRepository } from './database/repository/items.repository';
import { ItemController } from './controller/items.controller';

export const DI = {} as {
  app: App;
  db: Database;
  server: Server;
  routes: Routes;
  repositories: {
    user: UserRepository;
    items: ItemsRepository;
    //todo hier repository
  };
  controllers: {
    auth: AuthController;
    health: HealthController;
    items: ItemController;
    //todo hier controller
  };
  utils: {
    passwordHasher: PasswordHasher;
    jwt: Jwt;
  };

};

export function initializeDependencyInjection(): void {
  process.env.DATABASE_URL = ENV.DATABASE_URL;

  // Initialize database
  DI.db = db;

  DI.utils = {
    passwordHasher: new PasswordHasher(10),
    jwt: new Jwt(ENV.JWT_SECRET,
      {
        expiresIn: 3600,
        issuer: 'http://fwe.auth', // TODO unser Server
      }),
  };

  DI.repositories = {
    user: new UserRepository(DI.db),
    items: new ItemsRepository(DI.db),
    //todo hier repository
  };

  DI.controllers = {
    auth: new AuthController(
      DI.repositories.user,
      DI.utils.passwordHasher,
      DI.utils.jwt,
    ),
    health: new HealthController(), //todo hier auch die anderen Controller hinzufügen
    items: new ItemController(DI.repositories.items),
  };

  // Initialize routes
  DI.routes = new Routes(
    DI.controllers.auth,
    DI.controllers.health,
  );


  // Initialize app
  DI.app = new App(DI.routes);
  DI.server = new Server(DI.app, ENV);
}

