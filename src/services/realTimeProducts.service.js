import { Product } from "../models/products.model.js";

class RealTimeProductsService {
  async getAllProducts() {
    return await Product.find();
  }

  isAdmin(user) {
    return user.role === "admin";
  }

  prepareResponseForNonAdmin(user) {
    return {
      view: "accesDenied",
      data: {
        title: "Acceso Denegado",
        message: "No tienes permisos para acceder a esta página.",
        usuario: user,
      },
    };
  }

  prepareResponseForAdmin(products, user) {
    return {
      view: "realTimeProducts",
      data: {
        title: "Productos en tiempo real",
        products,
        usuario: user,
      },
    };
  }

  prepareErrorResponse(user) {
    return {
      view: "error",
      data: {
        title: "Error",
        message: "Error al obtener productos en tiempo real",
        usuario: user,
      },
    };
  }
}

export default new RealTimeProductsService();
