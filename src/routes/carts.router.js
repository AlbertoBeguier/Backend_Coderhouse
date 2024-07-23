import { Router } from "express"; // Importa el módulo Router de Express
import cartManager from "../cartManager.js"; // Importa el módulo cartManager para manejar carritos

const router = Router(); // Crea una nueva instancia del enrutador

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart(); // Crea un nuevo carrito
    res.status(201).send(newCart); // Devuelve el carrito creado con un código de estado 201
  } catch (error) {
    res.status(500).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

// Ruta para obtener todos los carritos con limitación
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit); // Obtiene el parámetro 'limit' de la query string y lo convierte a un número entero
  const carts = await cartManager.getCarts(); // Obtiene todos los carritos del cartManager
  if (limit && limit > 0) {
    // Verifica si el parámetro 'limit' es válido y mayor que 0
    return res.status(200).send(carts.slice(0, limit)); // Si 'limit' es válido, devuelve solo la cantidad de carritos especificados
  }
  res.status(200).send(carts); // Si 'limit' no es válido, devuelve todos los carritos
});

// Ruta para obtener los productos de un carrito por su ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(parseInt(req.params.cid)); // Obtiene el carrito por su ID
    res.status(200).send(cart.products); // Devuelve los productos del carrito encontrado
  } catch (error) {
    res.status(404).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(
      parseInt(req.params.cid),
      parseInt(req.params.pid)
    ); // Agrega un producto al carrito especificado
    res.status(200).send(cart); // Devuelve el carrito actualizado
  } catch (error) {
    res.status(404).send({ error: error.message }); // Si ocurre un error, devuelve un mensaje de error
  }
});

export default router; // Exporta el enrutador para ser utilizado en otros archivos
