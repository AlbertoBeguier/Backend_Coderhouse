import realTimeProductsService from "../services/realTimeProducts.service.js";

class RealTimeProductsController {
  async getProducts(req, res) {
    console.log("Usuario en la ruta:", req.user);
    try {
      if (!realTimeProductsService.isAdmin(req.user)) {
        const response = realTimeProductsService.prepareResponseForNonAdmin(
          req.user
        );
        return res.render(response.view, response.data);
      }

      const products = await realTimeProductsService.getAllProducts();
      const response = realTimeProductsService.prepareResponseForAdmin(
        products,
        req.user
      );
      res.render(response.view, response.data);
    } catch (error) {
      console.error("Error al obtener productos en tiempo real:", error);
      const response = realTimeProductsService.prepareErrorResponse(req.user);
      res.status(500).render(response.view, response.data);
    }
  }
}

export default new RealTimeProductsController();
