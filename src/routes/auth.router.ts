import { Router } from "express";
import { CCreateAdmin, CDeleteAdmin, CLoginAdmin, CUpdateAdmin } from "../controllers/auth.controller.js";
import { MInvalidateCache } from "../middlewares/cache.middleware.js";

const router = Router();

router.post("/login", CLoginAdmin);
router.post('/create', MInvalidateCache(["medium_cache:*"]), CCreateAdmin);
router.put('/:id', MInvalidateCache(["medium_cache:*"]), CUpdateAdmin);
router.delete('/:id', MInvalidateCache(["medium_cache:*"]), CDeleteAdmin);

export default router;