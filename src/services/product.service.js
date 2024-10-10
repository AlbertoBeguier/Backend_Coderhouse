// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\services\product.service.js

import { Product } from "../models/products.model.js";
import database from "../config/database.js";
import { daoConfig } from "../config/configDao.js";

class ProductService {
  constructor() {
    this.dao = null;
    database;
  }

  async initializeDAO() {
    if (!this.dao) {
      if (daoConfig.useJsonStorage) {
        const { default: createJsonProductDAO } = await import(
          "../dao/jsonProductDAO.js"
        );
        this.dao = createJsonProductDAO();
      } else {
        const { default: createMongoProductDAO } = await import(
          "../dao/mongoProductDAO.js"
        );
        this.dao = createMongoProductDAO();
      }
    }
  }

  async getAllProducts(sortOrder) {
    await this.initializeDAO();
    try {
      if (daoConfig.useJsonStorage) {
        return await this.dao.getAllProducts(sortOrder);
      } else {
        return await Product.find().sort({ price: sortOrder });
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  }

  async getProductsPaginated(page, limit) {
    await this.initializeDAO();
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
      };
      if (daoConfig.useJsonStorage) {
        return await this.dao.getProductsPaginated(page, limit);
      } else {
        return await Product.paginate({}, options);
      }
    } catch (error) {
      console.error("Error al obtener productos paginados:", error);
      throw error;
    }
  }

  async getProductById(id) {
    await this.initializeDAO();
    try {
      if (daoConfig.useJsonStorage) {
        return await this.dao.getProductById(id);
      } else {
        return await Product.findById(id);
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  }

  async createProduct(productData) {
    await this.initializeDAO();
    try {
      if (daoConfig.useJsonStorage) {
        return await this.dao.createProduct(productData);
      } else {
        const newProduct = new Product(productData);
        return await newProduct.save();
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    await this.initializeDAO();
    try {
      if (daoConfig.useJsonStorage) {
        return await this.dao.deleteProduct(id);
      } else {
        return await Product.findByIdAndDelete(id);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    await this.initializeDAO();
    try {
      if (daoConfig.useJsonStorage) {
        return await this.dao.updateProduct(id, updateData);
      } else {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }
}

export default new ProductService();
