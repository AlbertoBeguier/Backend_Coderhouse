document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn"); // Cambiado a clase
  const cartIcon = document.getElementById("cart-count");

  if (!cartIcon) {
    console.error("No se encontró el ícono del carrito en el DOM.");
    return;
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");

      if (!productId) {
        console.error("ID de producto no encontrado.");
        return;
      }

      fetch(`/carritos/add/${productId}`, { method: "POST" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar el producto al carrito");
          }
          return response.json();
        })
        .then((cart) => {
          if (cart.products && cart.products.length > 0) {
            const cartCount = cart.products.reduce(
              (acc, product) => acc + product.quantity,
              0
            );
            cartIcon.textContent = cartCount; // Actualiza el contador de productos
          } else {
            cartIcon.textContent = 0;
          }
          alert("Producto agregado al carrito");
        })
        .catch((error) => {
          console.error("Error al agregar producto al carrito:", error);
          alert("Hubo un error al agregar el producto al carrito.");
        });
    });
  });
});
