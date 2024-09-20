import { Router } from "express";
const router = Router();

router.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

export default router;
