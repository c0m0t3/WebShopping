import { App } from './app';
import { ENV } from './config/env.config';
import { Database, db } from './database';
import { Server } from './server';

export const DI = {} as {
  app: App,
  server: Server,
  db: Database
};

export function initializeDependencyInjection(): void {
  // Initialize database
  DI.db = db;

  // Initialize app
  DI.app = new App();
  DI.server = new Server(DI.app, ENV);
}