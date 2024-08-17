import { Product } from './models/product.model.js'; // Importa el modelo de Mongoose

class ProductManager {
  constructor() {
    this.products = [];
  }

  async getProducts() {
    try {
      return await Product.find(); // Obtiene todos los productos de la base de datos
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  }

  async addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const newProduct = new Product({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
      });
      await newProduct.save(); // Guarda el nuevo producto en la base de datos
      return newProduct;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id); // Obtiene un producto por su ID en la base de datos
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  }

  async removeProduct(id) {
    try {
      await Product.findByIdAndDelete(id); // Elimina un producto por su ID
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      return await Product.findByIdAndUpdate(id, updatedFields, { new: true }); // Actualiza un producto
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }
}

export default new ProductManager();

