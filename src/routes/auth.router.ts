import { Router } from "express";
import { CDeleteAdmin, CLogin, CRegister, CUpdateAdmin } from "../controllers/auth.controller.js";
import { VDeleteAdmin, VRegister, VUpdateAdmin } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/login", CLogin);
router.post('/create', VRegister, CRegister);
router.put('/:id', VUpdateAdmin, CUpdateAdmin);
router.delete('/:id', VDeleteAdmin, CDeleteAdmin);

export default router;