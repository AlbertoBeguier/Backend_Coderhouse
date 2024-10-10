import { Cart } from "../models/carts.model.js";
import { Product } from "../models/products.model.js";
import mongoose from "mongoose";
import database from "../config/database.js";

class CartService {
  constructor() {
    database;
  }

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

  async addProductToUserCart(userId, productId, quantity = 1) {
    try {
      const cart = await this.createCartForUser(userId);
      let product;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      } else {
        product = await Product.findOne({ id: productId });
      }
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      const productExist = cart.products.find(
        (p) => p.product.toString() === product._id.toString()
      );
      if (!productExist) {
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

  async getUserCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).populate("products.product");
      if (!cart) {
        return { carritos: [], total: 0 };
      }
      const total = this.calculateTotal(cart);
      return { carritos: [cart], total };
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  async removeOneProductUnit(userId, productId) {
    try {
      const cart = await Cart.findOne({ userId }).populate("products.product");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productIndex = cart.products.findIndex(
        (p) => p.product._id.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error(
        "Error al eliminar una unidad de producto del carrito:",
        error
      );
      throw error;
    }
  }

  async emptyCart(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      throw error;
    }
  }

  async getCartCount(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart || !cart.products.length) {
        return 0;
      }
      return cart.products.reduce((acc, product) => acc + product.quantity, 0);
    } catch (error) {
      console.error("Error al obtener el conteo del carrito:", error);
      throw error;
    }
  }

  calculateTotal(cart) {
    return cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}

export default new CartService();
