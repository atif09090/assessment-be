import { Router } from "express";
import { AuthMiddleWare } from "../middleware/auth.middleware";
import { DailyLogController } from "../controllers/daily-log.controller";

const router = Router();


router.get('/', AuthMiddleWare.authenticateJWT, DailyLogController.getLogs)
router.post('/', AuthMiddleWare.authenticateJWT, DailyLogController.postLog)

export default router