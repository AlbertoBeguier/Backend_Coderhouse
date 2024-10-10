import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import RealTimeProductsController from "../controllers/realTimeProducts.controller.js";

const router = Router();

router.get("/", authMiddleware, RealTimeProductsController.getProducts);

export default router;
