import productService from "../services/product.service.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const sortOrder = req.query.sort === "asc" ? 1 : -1;
      const products = await productService.getAllProducts(sortOrder);
      res.status(200).json({
        status: "success",
        payload: products,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error al obtener productos",
        error: error.message,
      });
    }
  }

  async getProductsPaginated(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;
      const result = await productService.getProductsPaginated(page, limit);
      res.render("productos", {
        title: "Productos",
        products: result.docs,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        currentPage: result.page,
        totalPages: result.totalPages,
      });
    } catch (error) {
      res.status(500).send({ error: "Error al obtener productos" });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.pid);
      if (product) {
        if (req.headers["x-requested-with"] === "XMLHttpRequest") {
          // Si es una solicitud AJAX, devolver solo el HTML parcial
          res.render("partials/producto-detalle", { product }, (err, html) => {
            if (err) {
              res
                .status(500)
                .send({ error: "Error al renderizar el producto" });
            } else {
              res.send(html);
            }
          });
        } else {
          // Si es una solicitud normal, renderizar la página completa
          res.render("product", { title: product.title, product });
        }
      } else {
        res.status(404).send({ error: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).send({ error: "Error al obtener el producto" });
    }
  }

  async createProduct(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el producto" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const deletedProduct = await productService.deleteProduct(req.params.pid);
      if (deletedProduct) {
        res.status(200).json({ message: "Producto eliminado" });
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.pid,
        req.body
      );
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  }
}

export default new ProductController();
