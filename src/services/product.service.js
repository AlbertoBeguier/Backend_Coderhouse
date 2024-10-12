import ProductRepository from "../repository/product.repository.js";
import { Product } from "../models/products.model.js";
import { daoConfig } from "../config/configDao.js";
import database from "../config/database.js";

class ProductService {
  constructor() {
    this.dao = null;
    this.productRepository = null;
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
      this.productRepository = new ProductRepository(this.dao);
    }
  }

  async getAllProducts(sortOrder) {
    await this.initializeDAO();
    return await this.productRepository.getAllProducts(sortOrder);
  }

  async getProductsPaginated(page, limit) {
    await this.initializeDAO();
    return await this.productRepository.getProductsPaginated(page, limit);
  }

  async getProductById(id) {
    await this.initializeDAO();
    return await this.productRepository.getProductById(id);
  }

  async createProduct(productData) {
    await this.initializeDAO();
    return await this.productRepository.createProduct(productData);
  }

  async deleteProduct(id) {
    await this.initializeDAO();
    return await this.productRepository.deleteProduct(id);
  }

  async updateProduct(id, updateData) {
    await this.initializeDAO();
    return await this.productRepository.updateProduct(id, updateData);
  }
}

export default new ProductService();
