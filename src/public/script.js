document.addEventListener("DOMContentLoaded", function () {
  console.log("Página cargada");

  const images = [
    "https://tecnosoluciones.com/wp-content/uploads/2023/04/que-productos-vender-en-una-tienda-virtual-o-comercio-electronico.jpg",
    "https://www.niubiz.com.pe/wp-content/uploads/2022/04/Tienda-Virtual-Niubiz.jpg",
    "https://thelogisticsworld.com/wp-content/uploads/2022/09/Concepto-de-compras-en-linea-y-comercio-electronico.jpg",
  ];

  let currentIndex = 0;

  function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    const headerImage = document.getElementById("header-image");
    if (headerImage) {
      headerImage.src = images[currentIndex];
    }
  }

  setInterval(changeImage, 10000); // Cambia la imagen cada 10 segundos

  const titleElement = document.getElementById("dynamic-title");
  const titles = ["Proyecto Coderhouse", "Tienda Virtual", "Alberto Beguier"];
  let titleIndex = 0;

  function updateTitle() {
    titleIndex = (titleIndex + 1) % titles.length;
    if (titleElement) {
      titleElement.textContent = titles[titleIndex];
    }
  }

  setInterval(updateTitle, 5000); // Cambia el título cada 5 segundos
});

function verCaracteristicas(title) {
  const productos = document.querySelectorAll(".producto");
  productos.forEach(producto => {
    if (producto.querySelector("h2").textContent === title) {
      const caracteristicas = producto.querySelector(".caracteristicas");
      const display = caracteristicas.style.display;
      caracteristicas.style.display = display === "none" ? "flex" : "none";
      producto.querySelector(".derecha-thumbnail").classList.toggle("hidden");
    }
  });
}
