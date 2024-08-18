import { Router } from "express";
import { Product } from "../models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Obtiene los productos desde MongoDB
    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos en tiempo real:", error);
    res.status(500).send("Error al obtener productos en tiempo real");
  }
});

export default router;

