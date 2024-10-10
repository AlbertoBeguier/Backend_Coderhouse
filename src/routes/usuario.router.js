import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import passport from "passport";

const router = Router();

// Registro
router.post("/register", UserController.register);

// Login
router.post("/login", UserController.login);

// Logout
router.post("/logout", UserController.logout);

// Current User
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  UserController.current
);

// Admin
router.get(
  "/admin",
  passport.authenticate("current", { session: false }),
  UserController.admin
);

export default router;
