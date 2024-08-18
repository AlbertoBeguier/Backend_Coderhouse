import { Router } from "express";
import { Product } from "../models/products.model.js"; 

const router = Router();

// Ruta para obtener todos los productos con paginación
router.get("/", async (req, res) => {
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

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
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

// Rutas adicionales para crear, actualizar y eliminar productos (pueden permanecer como JSON si no necesitan vistas específicas)
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, thumbnails } = req.body;
    const newProduct = new Product({ title, description, code, price, stock, thumbnails });
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ error: "Error al crear el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (deletedProduct) {
      res.status(200).send({ message: "Producto eliminado" });
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (updatedProduct) {
      res.status(200).send(updatedProduct);
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al actualizar el producto" });
  }
});

export default router;



