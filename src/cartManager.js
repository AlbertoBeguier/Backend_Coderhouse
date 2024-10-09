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

  // Método para obtener el carrito del usuario
  async getUserCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).populate("products.product");
      console.log("Carrito encontrado:", cart);
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  // Método para eliminar una unidad de un producto del carrito
  async removeOneProductUnit(userId, productId) {
    try {
      const cart = await this.getUserCart(userId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      let product;
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      } else {
        product = await Product.findOne({ id: productId });
      }

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      console.log(`Producto encontrado en la base de datos: ${product}`);

      // Log adicional para verificar todos los productos en el carrito
      console.log("Productos en el carrito:", cart.products);

      // Convertimos ambos IDs a cadenas para compararlos correctamente
      const productInCart = cart.products.find(
        (p) => p.product._id.toString() === product._id.toString()
      );

      console.log(`Producto encontrado en el carrito: ${productInCart}`);

      if (!productInCart) {
        throw new Error("Producto no encontrado en el carrito");
      }

      if (productInCart.quantity > 1) {
        productInCart.quantity -= 1;
      } else {
        cart.products = cart.products.filter(
          (p) => p.product._id.toString() !== product._id.toString()
        );
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
