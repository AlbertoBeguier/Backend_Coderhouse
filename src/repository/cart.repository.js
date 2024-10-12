export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async createCartForUser(userId) {
    return await this.dao.createCartForUser(userId);
  }

  async addProductToUserCart(userId, productId, quantity) {
    return await this.dao.addProductToUserCart(userId, productId, quantity);
  }

  async getUserCart(userId) {
    return await this.dao.getUserCart(userId);
  }

  async removeOneProductUnit(userId, productId) {
    return await this.dao.removeOneProductUnit(userId, productId);
  }

  async emptyCart(userId) {
    return await this.dao.emptyCart(userId);
  }

  async getCartCount(userId) {
    return await this.dao.getCartCount(userId);
  }
}
