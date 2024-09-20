import { Router } from "express";
import { Product } from "../models/products.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  console.log("Usuario en la ruta:", req.user);
  try {
    if (req.user.role !== "admin") {
      return res.render("accesDenied", {
        title: "Acceso Denegado",
        message: "No tienes permisos para acceder a esta página.",
        usuario: req.user,
      });
    }

    const products = await Product.find();
    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      products,
      usuario: req.user,
    });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Error al obtener productos en tiempo real",
      usuario: req.user,
    });
  }
});

export default router;
