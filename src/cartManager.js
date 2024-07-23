import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define la clase CartManager que gestionará las operaciones relacionadas con los carritos de compra
class CartManager {
  constructor(filePath) {
    // Guarda la ruta del archivo donde se almacenarán los carritos
    this.path = filePath;
    // Inicializa un array vacío para los carritos
    this.carts = [];
    // Inicializa el ID del carrito
    this.id = 1;
  }

  // Método para cargar los carritos desde el archivo
  async loadCarts() {
    try {
      // Verifica si el archivo existe
      await fs.promises.access(this.path);
      // Lee el contenido del archivo
      const data = await fs.promises.readFile(this.path, "utf-8");
      // Devuelve los carritos como un objeto JavaScript
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, lo crea y devuelve un array vacío
      if (error.code === "ENOENT") {
        console.log(
          "El archivo no existe, se creará uno nuevo al guardar carritos."
        );
        return [];
      } else {
        // Maneja otros errores
        console.error("Error al cargar carritos:", error);
        return [];
      }
    }
  }

  // Método para guardar los carritos en el archivo
  async saveCarts(carts) {
    try {
      // Escribe los carritos en el archivo en formato JSON
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      // Maneja errores de escritura
      console.error("Error al guardar carritos:", error);
    }
  }

  // Método para obtener todos los carritos
  async getCarts() {
    // Carga y devuelve los carritos
    return await this.loadCarts();
  }

  // Método para crear un nuevo carrito
  async createCart() {
    // Carga los carritos existentes
    const carts = await this.loadCarts();
    // Crea un nuevo carrito con un ID único y un array vacío de productos
    const newCart = {
      id: carts.length ? Math.max(...carts.map(c => c.id)) + 1 : 1,
      products: [],
    };
    // Agrega el nuevo carrito al array de carritos
    carts.push(newCart);
    // Guarda los carritos actualizados en el archivo
    await this.saveCarts(carts);
    // Devuelve el nuevo carrito creado
    return newCart;
  }

  // Método para obtener un carrito por su ID
  async getCartById(id) {
    // Carga los carritos existentes
    const carts = await this.loadCarts();
    // Busca el carrito por su ID
    const cart = carts.find(cart => cart.id === id);
    // Si el carrito no se encuentra, lanza un error
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    // Devuelve el carrito encontrado
    return cart;
  }

  // Método para agregar un producto a un carrito
  async addProductToCart(cartId, productId) {
    // Carga los carritos existentes
    const carts = await this.loadCarts();
    // Busca el índice del carrito por su ID
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    // Si el carrito no se encuentra, lanza un error
    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado");
    }

    // Obtiene el carrito encontrado
    const cart = carts[cartIndex];
    // Busca el índice del producto en el carrito
    const productIndex = cart.products.findIndex(
      product => product.product === productId
    );

    // Si el producto no se encuentra en el carrito, lo agrega con una cantidad de 1
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      // Si el producto ya está en el carrito, incrementa la cantidad
      cart.products[productIndex].quantity += 1;
    }

    // Guarda los carritos actualizados en el archivo
    await this.saveCarts(carts);
    // Devuelve el carrito actualizado
    return cart;
  }
}

// Obtener el directorio actual en un módulo ES
const __filename = fileURLToPath(import.meta.url);
// Obtener el nombre del directorio actual
const __dirname = path.dirname(__filename);

// Crear una instancia de CartManager con la ruta al archivo de carritos
const cartManager = new CartManager(path.join(__dirname, "./data/carts.json"));

// Exportar la instancia de CartManager para ser utilizada en otros archivos
export default cartManager;
