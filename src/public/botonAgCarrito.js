document.getElementById('add-to-cart-btn').addEventListener('click', function() {
  const productId = this.getAttribute('data-product-id');
  const cartId = this.getAttribute('data-cart-id'); // Obtener el cartId si está disponible

  // Si `cartId` está presente, agregar al carrito existente
  const cartFetchUrl = cartId ? `/carritos/${cartId}/product/${productId}` : '/carritos';

  if (cartId) {
    // Agregar producto al carrito existente
    fetch(cartFetchUrl, { 
      method: 'POST'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al agregar el producto al carrito');
      }
      return response.json();
    })
    .then(data => {
      alert('Producto agregado al carrito existente');
      console.log('Producto agregado:', data);
    })
    .catch(error => {
      console.error('Error al agregar el producto al carrito:', error);
      alert('Hubo un error al agregar el producto al carrito.');
    });
  } else {
    // Crear un nuevo carrito y agregar el producto
    fetch('/carritos', {
      method: 'POST'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al crear un nuevo carrito');
      }
      return response.json();
    })
    .then(cartData => {
      const newCartId = cartData.id;
      return fetch(`/carritos/${newCartId}/product/${productId}`, {
        method: 'POST'
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al agregar el producto al nuevo carrito');
      }
      return response.json();
    })
    .then(data => {
      alert('Producto agregado al nuevo carrito');
      console.log('Producto agregado:', data);
    })
    .catch(error => {
      console.error('Error al agregar el producto al nuevo carrito:', error);
      alert('Hubo un error al agregar el producto al nuevo carrito.');
    });
  }
});

