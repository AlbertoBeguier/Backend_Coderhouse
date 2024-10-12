export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllProducts(sortOrder) {
    return await this.dao.getAllProducts(sortOrder);
  }

  async getProductsPaginated(page, limit) {
    return await this.dao.getProductsPaginated(page, limit);
  }

  async getProductById(id) {
    return await this.dao.getProductById(id);
  }

  async createProduct(productData) {
    return await this.dao.createProduct(productData);
  }

  async deleteProduct(id) {
    return await this.dao.deleteProduct(id);
  }

  async updateProduct(id, updateData) {
    return await this.dao.updateProduct(id, updateData);
  }
}
