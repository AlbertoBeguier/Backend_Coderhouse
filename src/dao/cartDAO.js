/**
 * @typedef {Object} CartDAO
 * @property {function(string): Promise<Object>} createCartForUser
 * @property {function(string, string, number): Promise<Object>} addProductToUserCart
 * @property {function(string): Promise<Object>} getUserCart
 * @property {function(string, string): Promise<Object>} removeOneProductUnit
 * @property {function(string): Promise<Object>} emptyCart
 * @property {function(string): Promise<number>} getCartCount
 */

/**
 * Crea una instancia de CartDAO
 * @returns {CartDAO}
 */
function createCartDAO() {
  return {
    createCartForUser: async (userId) => {
      throw new Error("Method not implemented");
    },
    addProductToUserCart: async (userId, productId, quantity) => {
      throw new Error("Method not implemented");
    },
    getUserCart: async (userId) => {
      throw new Error("Method not implemented");
    },
    removeOneProductUnit: async (userId, productId) => {
      throw new Error("Method not implemented");
    },
    emptyCart: async (userId) => {
      throw new Error("Method not implemented");
    },
    getCartCount: async (userId) => {
      throw new Error("Method not implemented");
    },
  };
}

export default createCartDAO;
