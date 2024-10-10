// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\controllers\cart.controller.js

import cartService from "../services/cart.service.js";

class CartController {
  async addProductToCart(req, res) {
    try {
      console.log("Usuario autenticado:", req.user);
      const userId = req.user.id;
      const productId = req.params.productId;
      const cart = await cartService.addProductToUserCart(userId, productId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserCart(req, res) {
    try {
      const { carritos, total } = await cartService.getUserCart(req.user.id);
      res.render("carritos", { carritos, total });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
      const cart = await cartService.removeOneProductUnit(userId, productId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async emptyCart(req, res) {
    try {
      const userId = req.user.id;
      const cart = await cartService.emptyCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartCount(req, res) {
    try {
      const totalQuantity = await cartService.getCartCount(req.user.id);
      res.json({ totalQuantity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CartController();
