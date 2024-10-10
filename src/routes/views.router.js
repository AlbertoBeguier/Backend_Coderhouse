import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const router = Router();

router.get("/register", UserController.renderRegister);
router.get("/login", UserController.renderLogin);

export default router;
