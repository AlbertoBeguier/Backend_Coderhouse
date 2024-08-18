document.getElementById('add-to-cart-btn').addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
  
    // Crear un carrito nuevo o usar uno existente
    fetch('/api/carritos', {
      method: 'POST'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al crear o encontrar el carrito');
      }
      return response.json();
    })
    .then(cartData => {
      const cartId = cartData.id; // Obtener el ID del carrito
      return fetch(`/api/carritos/${cartId}/product/${productId}`, {
        method: 'POST'
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al agregar el producto al carrito');
      }
      return response.json();
    })
    .then(data => {
      alert('Producto agregado al carrito');
      console.log('Producto agregado:', data);
    })
    .catch(error => {
      console.error('Error al agregar el producto al carrito:', error);
      alert('Hubo un error al agregar el producto al carrito.');
    });
  });