import { Router } from "express";
import { CCreateAdmin, CDeleteAdmin, CLogin, CUpdateAdmin } from "../controllers/auth.controller.js";
import { VCreateAdmin, VDeleteAdmin, VUpdateAdmin } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/login", CLogin);
router.post('/create', VCreateAdmin, CCreateAdmin);
router.put('/:id', VUpdateAdmin, CUpdateAdmin);
router.delete('/:id', VDeleteAdmin, CDeleteAdmin);

export default router;