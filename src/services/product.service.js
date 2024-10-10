import { Product } from "../models/products.model.js";

class ProductService {
  async getAllProducts(sortOrder) {
    return await Product.find().sort({ price: sortOrder });
  }

  async getProductsPaginated(page, limit) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true,
    };
    return await Product.paginate({}, options);
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async createProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default new ProductService();
