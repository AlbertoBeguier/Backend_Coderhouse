import { Router } from "express"; 
import { Product } from "../models/products.model.js"; // Importa el modelo de productos

const router = Router(); 

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); 
    const products = await Product.find().limit(limit > 0 ? limit : undefined); 
    res.status(200).send(products); 
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al obtener el producto" });
  }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, thumbnails } = req.body;
    const newProduct = new Product({
      title,
      description,
      code,
      price,
      stock,
      thumbnails,
    });
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ error: "Error al crear el producto" });
  }
});

// Ruta para eliminar un producto por su ID
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

// Ruta para actualizar un producto por su ID
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


