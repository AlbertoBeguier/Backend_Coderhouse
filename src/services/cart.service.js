// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\services\cart.service.js

import CartManager from "../cartManager.js";

class CartService {
  async addProductToUserCart(userId, productId) {
    return await CartManager.addProductToUserCart(userId, productId);
  }

  async getUserCart(userId) {
    const cart = await CartManager.getUserCart(userId);
    if (!cart) {
      return { carritos: [], total: 0 };
    }
    const total = this.calculateTotal(cart);
    return { carritos: [cart], total };
  }

  async removeOneProductUnit(userId, productId) {
    return await CartManager.removeOneProductUnit(userId, productId);
  }

  async emptyCart(userId) {
    return await CartManager.emptyCart(userId);
  }

  async getCartCount(userId) {
    const cart = await CartManager.getUserCart(userId);
    if (!cart || !cart.products.length) {
      return 0;
    }
    return cart.products.reduce((acc, product) => acc + product.quantity, 0);
  }

  calculateTotal(cart) {
    return cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}

export default new CartService();
