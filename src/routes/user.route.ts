import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleWare } from "../middleware/auth.middleware";

const router = Router();


router.get('/list',AuthMiddleWare.authenticateJWT,UserController.getAll)


export default router