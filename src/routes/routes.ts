import { Router } from 'express';
import { AuthController} from '../controller/auth.controller';
import { HealthController} from '../controller/health.controller';
//todo hier kommen die Controller der Klassen hin
import { verifyAccess } from '../middleware/auth.middleware'; //todo wird bei eigenen Routen benötigt



export class Routes {
  private router: Router;

  constructor(
    private readonly authController: AuthController, //todo hier auch die anderen Controller hinzufügen
    private readonly healthController: HealthController,) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/auth/register',
      this.authController.registerUser.bind(
        this.authController),
    );
    this.router.post(
      '/auth/login',
      this.authController.loginUser.bind(
        this.authController),
    );


    // Health routes
    this.router.get(
      '/health',
      this.healthController.getHealthStatus.bind(this.healthController),
    );


  }


  public getRouter(): Router {
    return this.router;
  }

}