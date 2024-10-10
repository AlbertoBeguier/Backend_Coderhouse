// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\dao\jsonCartDAO.js

import fs from "fs/promises";
import { daoConfig } from "../config/configDao.js";
import { v4 as uuidv4 } from "uuid";

async function readJsonFile() {
  try {
    const data = await fs.readFile(
      daoConfig.cartJsonFilePath,
      daoConfig.jsonFileEncoding
    );
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Si el archivo no existe, devuelve un array vacío
      return [];
    }
    throw error;
  }
}

async function writeJsonFile(data) {
  await fs.writeFile(daoConfig.cartJsonFilePath, JSON.stringify(data, null, 2));
}

function createJsonCartDAO() {
  return {
    async createCartForUser(userId) {
      try {
        const carts = await readJsonFile();
        let cart = carts.find((c) => c.userId.$oid === userId);
        if (!cart) {
          cart = {
            _id: { $oid: uuidv4() },
            userId: { $oid: userId },
            products: [],
            createdAt: { $date: new Date().toISOString() },
            updatedAt: { $date: new Date().toISOString() },
            __v: 0,
          };
          carts.push(cart);
          await writeJsonFile(carts);
        }
        return cart;
      } catch (error) {
        console.error("Error al crear carrito:", error);
        throw error;
      }
    },

    async addProductToUserCart(userId, productId, quantity = 1) {
      try {
        const carts = await readJsonFile();
        const cartIndex = carts.findIndex((c) => c.userId.$oid === userId);
        if (cartIndex === -1) {
          throw new Error("Carrito no encontrado");
        }
        const productIndex = carts[cartIndex].products.findIndex(
          (p) => p.product.$oid === productId
        );
        if (productIndex === -1) {
          carts[cartIndex].products.push({
            product: { $oid: productId },
            quantity,
            _id: { $oid: uuidv4() },
          });
        } else {
          carts[cartIndex].products[productIndex].quantity += quantity;
        }
        carts[cartIndex].updatedAt = { $date: new Date().toISOString() };
        await writeJsonFile(carts);
        return carts[cartIndex];
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        throw error;
      }
    },

    async getUserCart(userId) {
      try {
        const carts = await readJsonFile();
        return carts.find((c) => c.userId.$oid === userId) || null;
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
        throw error;
      }
    },

    async removeOneProductUnit(userId, productId) {
      try {
        const carts = await readJsonFile();
        const cartIndex = carts.findIndex((c) => c.userId.$oid === userId);
        if (cartIndex === -1) {
          throw new Error("Carrito no encontrado");
        }
        const productIndex = carts[cartIndex].products.findIndex(
          (p) => p.product.$oid === productId
        );
        if (productIndex === -1) {
          throw new Error("Producto no encontrado en el carrito");
        }
        if (carts[cartIndex].products[productIndex].quantity > 1) {
          carts[cartIndex].products[productIndex].quantity -= 1;
        } else {
          carts[cartIndex].products.splice(productIndex, 1);
        }
        carts[cartIndex].updatedAt = { $date: new Date().toISOString() };
        await writeJsonFile(carts);
        return carts[cartIndex];
      } catch (error) {
        console.error(
          "Error al eliminar una unidad de producto del carrito:",
          error
        );
        throw error;
      }
    },

    async emptyCart(userId) {
      try {
        const carts = await readJsonFile();
        const cartIndex = carts.findIndex((c) => c.userId.$oid === userId);
        if (cartIndex === -1) {
          throw new Error("Carrito no encontrado");
        }
        carts[cartIndex].products = [];
        carts[cartIndex].updatedAt = { $date: new Date().toISOString() };
        await writeJsonFile(carts);
        return carts[cartIndex];
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        throw error;
      }
    },

    async getCartCount(userId) {
      try {
        const carts = await readJsonFile();
        const cart = carts.find((c) => c.userId.$oid === userId);
        if (!cart || !cart.products.length) {
          return 0;
        }
        return cart.products.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
      } catch (error) {
        console.error("Error al obtener el conteo del carrito:", error);
        throw error;
      }
    },
  };
}

export default createJsonCartDAO;
