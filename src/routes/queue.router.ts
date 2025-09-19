import { Router } from "express";
import { 
    CClaimQueue,
    CNextQueue,
    CGetAllQueues,
    CGetQueueById,
    CUpdateQueueStatus,
    CDeleteQueue
} from "../controllers/queue.controller.js";
import { MAuthValidate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/claim", CClaimQueue);
router.post("/next/:counter_id", MAuthValidate, CNextQueue);
router.get("/", MAuthValidate, CGetAllQueues);
router.get("/:id", MAuthValidate, CGetQueueById);
router.put("/:id", MAuthValidate, CUpdateQueueStatus);
router.delete("/:id", MAuthValidate, CDeleteQueue);

export default router;