import { Router } from "express";
import productManager from "../productManager.js"; // Importa la instancia de ProductManager

const router = Router();

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {
    title: "Productos en tiempo real",
    products,
  });
});

export default router;
