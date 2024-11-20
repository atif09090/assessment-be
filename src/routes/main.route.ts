import { Router } from "express";
import authRoute from "./auth.route";
import dailyLogRoute from "./daily-log.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/patient-log", dailyLogRoute);

export default router;
