import { Router } from "express"; // Importa el módulo Router de Express
import productManager from "../productManager.js"; // Importa el módulo productManager para manejar productos

const router = Router(); // Crea una nueva instancia del enrutador

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit); // Obtiene el parámetro 'limit' de la query string y lo convierte a un número entero
  const products = await productManager.getProducts(); // Obtiene todos los productos del productManager
  if (limit && limit > 0) {
    // Verifica si el parámetro 'limit' es válido y mayor que 0
    return res.status(200).send(products.slice(0, limit)); // Si 'limit' es válido, devuelve solo la cantidad de productos especificados
  }
  res.status(200).send(products); // Si 'limit' no es válido, devuelve todos los productos
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(
      parseInt(req.params.pid)
    ); // Obtiene el producto por su ID
    res.status(200).send(product); // Devuelve el producto encontrado
  } catch (error) {
    res.status(404).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body; // Desestructura los campos del cuerpo de la solicitud
    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    }); // Crea un nuevo producto con los datos proporcionados
    res.status(201).send(newProduct); // Devuelve el producto creado con un código de estado 201
  } catch (error) {
    res.status(404).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

// Ruta para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
  try {
    await productManager.removeProduct(parseInt(req.params.pid)); // Elimina el producto por su ID
    res.status(200).send({ message: "Producto eliminado" }); // Devuelve un mensaje de éxito
  } catch (error) {
    res.status(404).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

// Ruta para actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      parseInt(req.params.pid),
      req.body
    ); // Actualiza el producto por su ID con los datos proporcionados
    res.status(200).send(updatedProduct); // Devuelve el producto actualizado
  } catch (error) {
    res.status(404).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

export default router; // Exporta el enrutador para ser utilizado en otros archivos
