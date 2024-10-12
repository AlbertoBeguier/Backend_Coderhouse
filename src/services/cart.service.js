import CartRepository from "../repository/cart.repository.js";
import { daoConfig } from "../config/configDao.js";
import { Product } from "../models/products.model.js";
import mongoose from "mongoose";
import fs from "fs/promises";

class CartService {
  constructor() {
    this.dao = null;
    this.cartRepository = null;
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
      this.cartRepository = new CartRepository(this.dao);
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
    return await this.cartRepository.createCartForUser(userId);
  }

  async addProductToUserCart(userId, productId, quantity = 1) {
    await this.initializeDAO();
    let product;
    if (daoConfig.useJsonStorage) {
      product = await this.getProductFromJson(productId);
    } else {
      product = mongoose.Types.ObjectId.isValid(productId)
        ? await Product.findById(productId)
        : await Product.findOne({ id: productId });
    }
    if (!product) throw new Error("Producto no encontrado");
    if (product.stock < quantity) throw new Error("No hay suficiente stock");

    product.stock -= quantity;

    if (daoConfig.useJsonStorage) {
      const data = await fs.readFile(daoConfig.productJsonFilePath, "utf8");
      const products = JSON.parse(data);
      const productIndex = products.findIndex(
        (p) =>
          p._id.$oid === productId ||
          p._id === productId ||
          p.id.toString() === productId
      );
      if (productIndex !== -1) {
        products[productIndex].stock = product.stock;
        await fs.writeFile(
          daoConfig.productJsonFilePath,
          JSON.stringify(products, null, 2)
        );
      }
    } else {
      await product.save();
    }

    const productIdToUse = daoConfig.useJsonStorage
      ? product._id.$oid || product._id || product.id.toString()
      : product._id.toString();
    return await this.cartRepository.addProductToUserCart(
      userId,
      productIdToUse,
      quantity
    );
  }

  async getUserCart(userId) {
    await this.initializeDAO();
    const cart = await this.cartRepository.getUserCart(userId);
    if (!cart) return { carritos: [], total: 0 };

    if (daoConfig.useJsonStorage) {
      for (const item of cart.products) {
        const product = await this.getProductFromJson(
          item.product.$oid || item.product
        );
        if (product) item.product = product;
      }
    }

    const total = this.calculateTotal(cart);
    return { carritos: [cart], total };
  }

  async removeOneProductUnit(userId, productId) {
    await this.initializeDAO();
    return await this.cartRepository.removeOneProductUnit(userId, productId);
  }

  async emptyCart(userId) {
    await this.initializeDAO();
    return await this.cartRepository.emptyCart(userId);
  }

  async getCartCount(userId) {
    await this.initializeDAO();
    return await this.cartRepository.getCartCount(userId);
  }

  calculateTotal(cart) {
    return cart.products.reduce((sum, item) => {
      const price = item.product.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }
}

export default new CartService();
