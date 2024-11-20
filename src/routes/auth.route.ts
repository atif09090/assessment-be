import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { userRegistrationValidator } from "../utils/fields-validation";


const router = Router();


router.post('/register',userRegistrationValidator,AuthController.register);
router.post('/login',AuthController.login);
router.post('/refresh-token',AuthController.refreshToken);
router.post('/logout',AuthController.logout);
router.post("/google", AuthController.googleLogin);


export default router;