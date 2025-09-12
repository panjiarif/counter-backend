import { Router } from "express";
import { CCreateAdmin, CDeleteAdmin, CUpdateAdmin } from "../controllers/admin.controller.js";
import { VCreateAdmin, VDeleteAdmin, VUpdateAdmin } from "../middlewares/validate.middleware.js";

const router = Router();

// router.post("/login", CLoginAdmin);
// router.post("/create", CCreateAdmin);

// Endpoint untuk membuat admin
router.post('/create', VCreateAdmin, CCreateAdmin);

// Endpoint untuk memperbarui admin
router.put('/:id', VUpdateAdmin, CUpdateAdmin);

// Endpoint untuk menghapus admin
router.delete('/:id', VDeleteAdmin, CDeleteAdmin);

export default router;