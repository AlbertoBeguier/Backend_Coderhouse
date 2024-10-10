import fs from "fs/promises";
import { daoConfig } from "../config/configDao.js";
import createProductDAO from "./productDAO.js";

async function readJsonFile() {
  try {
    const data = await fs.readFile(
      daoConfig.productJsonFilePath,
      daoConfig.jsonFileEncoding
    );
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeJsonFile(data) {
  await fs.writeFile(
    daoConfig.productJsonFilePath,
    JSON.stringify(data, null, 2)
  );
}

function createJsonProductDAO() {
  const productDAO = createProductDAO();

  return {
    ...productDAO,
    async getAllProducts(sortOrder) {
      try {
        const products = await readJsonFile();
        return products.sort((a, b) => {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        });
      } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
      }
    },

    async getProductsPaginated(page, limit) {
      try {
        const products = await readJsonFile();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = products.slice(startIndex, endIndex);
        return {
          docs: paginatedProducts,
          totalDocs: products.length,
          limit: limit,
          totalPages: Math.ceil(products.length / limit),
          page: page,
          pagingCounter: startIndex + 1,
          hasPrevPage: page > 1,
          hasNextPage: endIndex < products.length,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: endIndex < products.length ? page + 1 : null,
        };
      } catch (error) {
        console.error("Error al obtener productos paginados:", error);
        throw error;
      }
    },

    async getProductById(id) {
      try {
        const products = await readJsonFile();
        return products.find(
          (p) => p._id.$oid === id || p.id.toString() === id
        );
      } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        throw error;
      }
    },

    async createProduct(productData) {
      try {
        const products = await readJsonFile();
        const newProduct = {
          ...productData,
          _id: { $oid: Date.now().toString() },
          createdAt: { $date: new Date().toISOString() },
          updatedAt: { $date: new Date().toISOString() },
        };
        products.push(newProduct);
        await writeJsonFile(products);
        return newProduct;
      } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
      }
    },

    async deleteProduct(id) {
      try {
        const products = await readJsonFile();
        const index = products.findIndex(
          (p) => p._id.$oid === id || p.id.toString() === id
        );
        if (index !== -1) {
          const deletedProduct = products.splice(index, 1)[0];
          await writeJsonFile(products);
          return deletedProduct;
        }
        return null;
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
      }
    },

    async updateProduct(id, updateData) {
      try {
        const products = await readJsonFile();
        const index = products.findIndex(
          (p) => p._id.$oid === id || p.id.toString() === id
        );
        if (index !== -1) {
          products[index] = {
            ...products[index],
            ...updateData,
            updatedAt: { $date: new Date().toISOString() },
          };
          await writeJsonFile(products);
          return products[index];
        }
        return null;
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
      }
    },
  };
}

export default createJsonProductDAO;
