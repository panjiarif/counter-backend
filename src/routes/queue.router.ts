import { Router } from "express";
import { CClaimQueue, CNextQueue } from "../controllers/queue.controller.js";
import { MAuthValidate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/claim", CClaimQueue);

router.post("/next/:counter_id", MAuthValidate, CNextQueue);

export default router;