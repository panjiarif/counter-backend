import { Router } from "express";
import {
    CCreateCounter,
    CDeleteCounter,
    CGetAllCounters,
    CGetCounterById,
    CUpdateCounterById,
    CUpdateCounterStatus
} from "../controllers/counter.controller.js";
import { MAuthValidate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", MAuthValidate, CCreateCounter);
router.get("/", MAuthValidate, CGetAllCounters);
router.get("/:id", MAuthValidate, CGetCounterById);
router.put("/:id", MAuthValidate, CUpdateCounterById);
router.delete("/:id", MAuthValidate, CDeleteCounter);
router.patch("/status/:id", MAuthValidate, CUpdateCounterStatus);

export default router;
