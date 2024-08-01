import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.id = 1;
  }

  async loadProducts() {
    try {
      await fs.promises.access(this.path);
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(
          "El archivo no existe, se creará uno nuevo al guardar productos."
        );
        return [];
      } else {
        console.error("Error al cargar productos:", error);
        return [];
      }
    }
  }

  async saveProducts(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al guardar productos:", error);
    }
  }

  async getProducts() {
    return await this.loadProducts();
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
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error(
        "Todos los campos son obligatorios, a excepción de thumbnails"
      );
    }

    const products = await this.loadProducts();
    const codeExists = products.some(product => product.code === code);
    if (codeExists) {
      throw new Error("El código del producto ya existe");
    }

    const newProduct = {
      id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails,
    };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  async getProductById(id) {
    const products = await this.loadProducts();
    const product = products.find(product => product.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async removeProduct(id) {
    let products = await this.loadProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    products.splice(index, 1);
    await this.saveProducts(products);
  }

  async updateProduct(id, updatedFields) {
    const products = await this.loadProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    const product = products[index];
    products[index] = { ...product, ...updatedFields, id: product.id };
    await this.saveProducts(products);
    return products[index];
  }
}

// Obtener el directorio actual en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una instancia de ProductManager con la ruta al archivo de productos
const productManager = new ProductManager(
  path.join(__dirname, "./data/products.json")
);

export default productManager;
