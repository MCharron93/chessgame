import { AuthController } from "./Controllers/AuthController.js";
import ChessController from "./Controllers/ChessController.js";

class App {
  authController = new AuthController();

  chessController = new ChessController();
}

window["app"] = new App();
