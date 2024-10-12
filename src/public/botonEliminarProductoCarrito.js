document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-product-btn");
  const emptyCartButton = document.getElementById("empty-cart-btn");
  const cartIcon = document.getElementById("cart-count");

  if (!cartIcon) {
    console.error("No se encontró el ícono del carrito en el DOM.");
    return;
  }

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");

      fetch(`/carritos/${productId}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar el producto del carrito");
          }
          return response.json();
        })
        .then((cart) => {
          const cartCount = cart.products.reduce(
            (acc, product) => acc + product.quantity,
            0
          );
          cartIcon.textContent = cartCount;
          alert("Producto eliminado del carrito");
          location.reload();
        })
        .catch((error) => {
          console.error("Error al eliminar producto del carrito:", error);
          alert("Hubo un error al eliminar el producto del carrito.");
        });
    });
  });

  // Vaciar carrito
  if (emptyCartButton) {
    emptyCartButton.addEventListener("click", function () {
      fetch(`/carritos`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al vaciar el carrito");
          }
          return response.json();
        })
        .then(() => {
          cartIcon.textContent = 0;
          alert("Carrito vaciado");
          location.reload();
        })
        .catch((error) => {
          console.error("Error al vaciar el carrito:", error);
          alert("Hubo un error al vaciar el carrito.");
        });
    });
  }
});
