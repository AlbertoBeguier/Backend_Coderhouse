import express from "express";
import { Product } from "../models/products.model.js"; 

const router = express.Router();

// Ruta para obtener todos los productos en formato JSON desde la base de datos
router.get("/api/products", async (req, res) => {
  try {
    const sortOrder = req.query.sort === 'asc' ? 1 : -1; // Verifica si se solicita un orden ascendente o descendente
    const products = await Product.find().sort({ price: sortOrder }); // Ordena los productos por precio
    res.status(200).json({
      status: "success",
      payload: products  // Devuelve los productos en formato JSON
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Error al obtener productos", 
      error: error.message 
    });
  }
});

// Ruta para obtener todos los productos con paginación y renderizado en vista
router.get("/productos", async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };

    const result = await Product.paginate({}, options);

    res.render("productos", { 
      title: "Productos", 
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

// Ruta para obtener un producto por su ID y renderizado en vista
router.get("/productos/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (product) {
      res.render("product", { title: product.title, product });
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al obtener el producto" });
  }
});

// Rutas adicionales para crear, actualizar y eliminar productos
router.post("/productos", async (req, res) => {
  try {
    const { title, description, code, price, stock, thumbnails } = req.body;
    const newProduct = new Product({ title, description, code, price, stock, thumbnails });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

router.delete("/productos/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (deletedProduct) {
      res.status(200).json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

router.put("/productos/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

export default router;
