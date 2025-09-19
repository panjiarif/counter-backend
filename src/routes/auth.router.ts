import { Router } from "express";
import { CDeleteAdmin, CGetAllAdmins, CLoginAdmin, CRegisterAdmin, CUpdateAdmin } from "../controllers/auth.controller.js";
import { CachePresents, MCache, MInvalidateCache } from "../middlewares/cache.middleware.js";
import { MAuthValidate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", CLoginAdmin);
router.post('/register', MInvalidateCache(["medium_cache:*"]), MAuthValidate, CRegisterAdmin);
router.put('/:id', MInvalidateCache(["medium_cache:*"]), MAuthValidate, CUpdateAdmin);
router.delete('/:id', MInvalidateCache(["medium_cache:*"]), MAuthValidate, CDeleteAdmin);
router.get('/', MCache(CachePresents.medium(300)), MAuthValidate, CGetAllAdmins);

export default router;