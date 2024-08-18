document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete-product-btn').forEach(button => {
      button.addEventListener('click', function() {
        const cartId = this.getAttribute('data-cart-id');
        const productId = this.getAttribute('data-product-id');

        fetch(`/carritos/${cartId}/products/${productId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito');
          }
          return response.json();
        })
        .then(data => {
          alert('Producto eliminado del carrito');
          location.reload(); // Recargar la página para actualizar la lista de productos
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un error al eliminar el producto del carrito.');
        });
      });
    });
  });