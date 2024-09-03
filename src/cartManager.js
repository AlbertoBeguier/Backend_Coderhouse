import { Cart } from "../models/carts.model.js";
import { Product } from "../models/products.model.js";

class CartManager {
  // Método para obtener todos los carritos
  async getCarts() {
    try {
      return await Cart.find().populate("products.product");
    } catch (error) {
      console.error("Error al obtener carritos:", error);
      throw error;
    }
  }

  // Método para crear un nuevo carrito sin importar si existen otros
  async createCart() {
    try {
      const lastCart = await Cart.findOne().sort({ id: -1 }); // Encuentra el último carrito para determinar el siguiente ID
      const newId = lastCart ? lastCart.id + 1 : 1; // Si no hay carritos, inicia en 1

      const cart = new Cart({ id: newId, products: [] });
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al crear carrito:", error);
      throw error;
    }
  }

  // Método para obtener un carrito por su ID
  async getCartById(cartId) {
    try {
      const cart = await Cart.findOne({ id: cartId }).populate(
        "products.product"
      );
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      throw error;
    }
  }

  // Método para agregar un producto a un carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const productExist = cart.products.find(
        (p) => p.product.toString() === productId
      );

      if (!productExist) {
        // Verifica si el producto existe en la base de datos antes de agregarlo
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("Producto no encontrado");
        }
        cart.products.push({ product: product._id, quantity });
      } else {
        productExist.quantity += quantity;
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  // Método para eliminar un producto de un carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = cart.products.filter((p) => !p.product.equals(productId));

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  // Método para actualizar el carrito con un arreglo de productos
  async updateCartProducts(cartId, products) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = products;
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error;
    }
  }

  // Método para actualizar la cantidad de un producto específico en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.products.findIndex((p) =>
        p.product.equals(productId)
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad de producto en el carrito:",
        error
      );
      throw error;
    }
  }

  // Método para eliminar todos los productos de un carrito
  async removeAllProductsFromCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = [];
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error(
        "Error al eliminar todos los productos del carrito:",
        error
      );
      throw error;
    }
  }
}

export default new CartManager();
