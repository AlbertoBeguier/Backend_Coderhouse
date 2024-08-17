document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  console.log("DOM fully loaded and parsed");

  // Emitir mensaje al servidor
  console.log("Emitir mensaje al servidor...");
  socket.emit("mensaje", "Hola desde el cliente");

  // Recibir mensaje del servidor
  socket.on("mensaje1", data => {
    console.log("Mensaje del servidor:", data);
  });

  // Manejo del envío del formulario para agregar un producto
  const productForm = document.getElementById("product-form");
  const successMessage = document.createElement("div");
  successMessage.id = "success-message";

  if (productForm) {
    console.log("Formulario encontrado");
    productForm.appendChild(successMessage);

    productForm.addEventListener("submit", e => {
      e.preventDefault();

      const title = document.getElementById("product-title")?.value.trim();
      const description = document.getElementById("product-description")?.value.trim();
      const code = document.getElementById("product-code")?.value.trim();
      const price = parseFloat(document.getElementById("product-price")?.value);
      const stock = parseInt(document.getElementById("product-stock")?.value, 10);
      const thumbnails = document.getElementById("product-thumbnails")?.value.trim();

      if (title && description && code && !isNaN(price) && !isNaN(stock)) {
        const newProduct = {
          title,
          description,
          code,
          price,
          stock,
          thumbnail: thumbnails,
        };
        console.log("Enviando nuevo producto:", newProduct); // Verifica los datos que se envían
        socket.emit("agregarProducto", newProduct);
      
        // Mostrar mensaje de éxito
        successMessage.textContent = "Producto agregado con éxito.";
        successMessage.style.color = "green";
      
        // Limpiar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          successMessage.textContent = "";
        }, 3000);
      
        // Limpiar el formulario
        productForm.reset();
      } else {
        alert("Todos los campos son obligatorios y deben ser válidos.");
      }
    });
  }

  // Recibir listado de productos del servidor
  socket.on("listado_de_productos", data => {
    console.log("Recibiendo listado de productos:", data);
    const productosContainer = document.getElementById("productos-listado");
    if (productosContainer) {
      productosContainer.innerHTML = data
        .map(producto => 
          `<div class="producto">
            <h3>${producto.title}</h3>
            <p>${producto.description}</p>
            <p>Precio: ${producto.price}</p>
            <img src="${producto.thumbnail}" alt="${producto.title}" class="thumbnail"/>
            <p>Código: ${producto.code}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="eliminarProducto('${producto._id}')" class="btn btn-danger">Eliminar</button>
          </div>`
        )
        .join("");
    }
  });

  // Función para eliminar un producto
  window.eliminarProducto = id => {
    socket.emit("eliminarProducto", id);
  };
});


