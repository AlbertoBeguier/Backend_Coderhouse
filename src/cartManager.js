import { Cart } from "../src/models/carts.model.js";
import { Product } from "../src/models/products.model.js";
import mongoose from "mongoose";

class CartManager {
  // Método para crear un carrito para un usuario si no tiene uno
  async createCartForUser(userId) {
    try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, products: [] });
        await cart.save();
      }

      return cart;
    } catch (error) {
      console.error("Error al crear carrito:", error);
      throw error;
    }
  }

  // Método para agregar un producto al carrito de un usuario
  async addProductToUserCart(userId, productId, quantity = 1) {
    try {
      const cart = await this.createCartForUser(userId);

      // Validamos si el productId es un ObjectId o un número
      let product;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      } else {
        product = await Product.findOne({ id: productId });
      }

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Verificar si el producto ya está en el carrito
      const productExist = cart.products.find(
        (p) => p.product.toString() === product._id.toString()
      );

      if (!productExist) {
        // Si el producto no está en el carrito, lo añadimos
        cart.products.push({ product: product._id, quantity });
      } else {
        // Si ya está, solo incrementamos la cantidad
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

  // Método para obtener el carrito del usuario
  async getUserCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).populate("products.product");
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  // Método para eliminar un producto del carrito
  async removeProductFromCart(userId, productId) {
    try {
      const cart = await this.getUserCart(userId);

      let product;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      } else {
        product = await Product.findOne({ id: productId });
      }

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== product._id.toString()
      );
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  // Método para vaciar el carrito
  async emptyCart(userId) {
    try {
      const cart = await this.getUserCart(userId);
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      throw error;
    }
  }
}

export default new CartManager();
