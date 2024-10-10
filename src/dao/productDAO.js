/**
 * @typedef {Object} ProductDAO
 * @property {function(string): Promise<Array>} getAllProducts
 * @property {function(number, number): Promise<Object>} getProductsPaginated
 * @property {function(string): Promise<Object>} getProductById
 * @property {function(Object): Promise<Object>} createProduct
 * @property {function(string): Promise<Object>} deleteProduct
 * @property {function(string, Object): Promise<Object>} updateProduct
 */

/**
 * Crea una instancia de ProductDAO
 * @returns {ProductDAO}
 */
function createProductDAO() {
  return {
    getAllProducts: async (sortOrder) => {
      throw new Error("Method not implemented");
    },
    getProductsPaginated: async (page, limit) => {
      throw new Error("Method not implemented");
    },
    getProductById: async (id) => {
      throw new Error("Method not implemented");
    },
    createProduct: async (productData) => {
      throw new Error("Method not implemented");
    },
    deleteProduct: async (id) => {
      throw new Error("Method not implemented");
    },
    updateProduct: async (id, updateData) => {
      throw new Error("Method not implemented");
    },
  };
}

export default createProductDAO;
