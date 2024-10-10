// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\services\cart.service.js

import { daoConfig } from "../config/configDao.js";
import { Product } from "../models/products.model.js";
import mongoose from "mongoose";
import fs from "fs/promises";

class CartService {
  constructor() {
    this.dao = null;
  }

  async initializeDAO() {
    if (!this.dao) {
      if (daoConfig.useJsonStorage) {
        const { default: createJsonCartDAO } = await import(
          "../dao/jsonCartDAO.js"
        );
        this.dao = createJsonCartDAO();
      } else {
        const { default: createMongoCartDAO } = await import(
          "../dao/mongoCartDAO.js"
        );
        this.dao = createMongoCartDAO();
      }
    }
  }

  async getProductFromJson(productId) {
    try {
      const data = await fs.readFile(daoConfig.productJsonFilePath, "utf8");
      const products = JSON.parse(data);
      return products.find(
        (p) =>
          p._id.$oid === productId ||
          p._id === productId ||
          p.id.toString() === productId
      );
    } catch (error) {
      console.error("Error al leer el archivo JSON de productos:", error);
      throw error;
    }
  }

  async createCartForUser(userId) {
    await this.initializeDAO();
    try {
      return await this.dao.createCartForUser(userId);
    } catch (error) {
      console.error("Error al crear carrito:", error);
      throw error;
    }
  }

  async addProductToUserCart(userId, productId, quantity = 1) {
    await this.initializeDAO();
    try {
      let product;
      if (daoConfig.useJsonStorage) {
        product = await this.getProductFromJson(productId);
      } else {
        if (mongoose.Types.ObjectId.isValid(productId)) {
          product = await Product.findById(productId);
        } else {
          product = await Product.findOne({ id: productId });
        }
      }
      if (!product) {
        console.error(`Producto no encontrado con ID: ${productId}`);
        throw new Error("Producto no encontrado");
      }
      const productIdToUse = daoConfig.useJsonStorage
        ? product._id.$oid || product._id || product.id.toString()
        : product._id.toString();
      return await this.dao.addProductToUserCart(
        userId,
        productIdToUse,
        quantity
      );
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async getUserCart(userId) {
    await this.initializeDAO();
    try {
      const cart = await this.dao.getUserCart(userId);
      if (!cart) {
        return { carritos: [], total: 0 };
      }

      if (daoConfig.useJsonStorage) {
        for (let item of cart.products) {
          const product = await this.getProductFromJson(
            item.product.$oid || item.product
          );
          if (product) {
            item.product = product;
          }
        }
      } else {
        // Existing MongoDB population logic
      }

      const total = this.calculateTotal(cart);
      return { carritos: [cart], total };
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  async removeOneProductUnit(userId, productId) {
    await this.initializeDAO();
    try {
      return await this.dao.removeOneProductUnit(userId, productId);
    } catch (error) {
      console.error(
        "Error al eliminar una unidad de producto del carrito:",
        error
      );
      throw error;
    }
  }

  async emptyCart(userId) {
    await this.initializeDAO();
    try {
      return await this.dao.emptyCart(userId);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      throw error;
    }
  }

  async getCartCount(userId) {
    await this.initializeDAO();
    try {
      return await this.dao.getCartCount(userId);
    } catch (error) {
      console.error("Error al obtener el conteo del carrito:", error);
      throw error;
    }
  }

  calculateTotal(cart) {
    return cart.products.reduce((sum, item) => {
      const price = item.product.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }
}

export default new CartService();
