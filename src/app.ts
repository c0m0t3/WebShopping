import express, { Application} from 'express';
import { globalErrorHandler} from './utils/global-error';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this._registerMiddlewares();
    this._registerErrorHandlers();
  }

  private _registerMiddlewares() {
    this.app.use(express.json());
    this.app.use((req, _res, next) => {
      console.info(`New request to ${req.method} ${req.url}`);
      next();
    });
  }

  private _registerErrorHandlers() {
    this.app.use(globalErrorHandler);
  }

  public listen(port: number, callback: () => void) {
    return this.app.listen(port, callback);
  }

}