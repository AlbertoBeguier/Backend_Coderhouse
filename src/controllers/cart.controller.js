import cartService from "../services/cart.service.js";
import ticketService from "../services/ticket.service.js"; // Asegúrate de importar el servicio de tickets

class CartController {
  async addProductToCart(req, res) {
    try {
      const userId = req.user.email;
      const productId = req.params.productId;
      const cart = await cartService.addProductToUserCart(userId, productId);
      res.status(200).json(cart);
    } catch (error) {
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

  // Nueva función para finalizar la compra y generar un ticket
  async purchaseCart(req, res) {
    try {
      const userId = req.user.email;
      const { carritos, total } = await cartService.getUserCart(userId);

      if (!carritos || carritos.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío." });
      }

      // Crear el ticket antes de vaciar el carrito
      const ticket = await ticketService.createTicket(
        userId,
        carritos[0].products,
        total
      );

      // Vaciar el carrito después de la compra
      await cartService.emptyCart(userId);

      res.status(200).json({
        message: "Compra finalizada con éxito",
        ticket,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CartController();
