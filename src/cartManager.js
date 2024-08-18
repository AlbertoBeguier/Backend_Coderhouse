import { Cart } from './models/cart.model.js'; // Importa el modelo de carritos

class CartManager {
  constructor() {
    this.carts = [];
  }

  // Método para obtener todos los carritos
  async getCarts() {
    try {
      return await Cart.find().populate('products.product');
    } catch (error) {
      console.error("Error al obtener carritos:", error);
      throw error;
    }
  }

  // Método para crear un nuevo carrito
  async createCart() {
    try {
      const lastCart = await Cart.findOne().sort({ id: -1 });
      const newId = lastCart ? lastCart.id + 1 : 1;
      const newCart = new Cart({ id: newId, products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al crear carrito:", error);
      throw error;
    }
  }

  // Método para obtener un carrito por su ID
  async getCartById(id) {
    try {
      const cart = await Cart.findOne({ id }).populate('products.product');
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
  async addProductToCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.products.findIndex(p => p.product.equals(productId));

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

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
      // Filtra los productos que no coinciden con el productId a eliminar
      cart.products = cart.products.filter(p => !p.product.equals(productId));
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }
}

export default new CartManager();

