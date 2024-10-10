import cartService from "../services/cart.service.js";

class CartController {
  async addProductToCart(req, res) {
    try {
      console.log(
        "req.user en addProductToCart:",
        JSON.stringify(req.user, null, 2)
      );
      const userId = req.user.email;
      const productId = req.params.productId;
      console.log(
        "Controller: Adding product to cart. UserId:",
        userId,
        "ProductId:",
        productId
      );
      const cart = await cartService.addProductToUserCart(userId, productId);
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error en addProductToCart:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserCart(req, res) {
    try {
      const { carritos, total } = await cartService.getUserCart(req.user.email);
      res.render("carritos", { carritos, total });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const userId = req.user.email;
      const productId = req.params.productId;
      const cart = await cartService.removeOneProductUnit(userId, productId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async emptyCart(req, res) {
    try {
      const userId = req.user.email;
      const cart = await cartService.emptyCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCartCount(req, res) {
    try {
      const totalQuantity = await cartService.getCartCount(req.user.email);
      res.json({ totalQuantity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CartController();
