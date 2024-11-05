import express, { Application} from 'express';
import { globalErrorHandler} from './utils/global-error';
import { Routes } from './routes/routes';
import helmet from 'helmet';
import { prepareAuthentication } from './middleware/auth.middleware'; //todo prüfen

export class App {
  private app: Application;

  constructor(private readonly routes: Routes) {
    this.app = express();
    this._registerMiddlewares();
    this._registerRoutes();
    this._registerErrorHandlers();
  }

  private _registerMiddlewares() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(prepareAuthentication);

    this.app.use((req, _res, next) => {
      console.info(`New request to ${req.method} ${req.url}`);
      next();
    });
  }

  private _registerRoutes() {
    this.app.use('/api', this.routes.getRouter());
  }

  private _registerErrorHandlers() {
    this.app.use(globalErrorHandler);
  }

  public listen(port: number, callback: () => void) {
    return this.app.listen(port, callback);
  }

}