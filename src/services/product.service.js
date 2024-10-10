import { Product } from "../models/products.model.js";
import database from "../config/database.js";

class ProductService {
  constructor() {
    database;
  }

  async getAllProducts(sortOrder) {
    try {
      return await Product.find().sort({ price: sortOrder });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  }

  async getProductsPaginated(page, limit) {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
      };
      return await Product.paginate({}, options);
    } catch (error) {
      console.error("Error al obtener productos paginados:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }
}

export default new ProductService();
