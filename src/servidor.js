import express from "express"; // Importa el módulo Express
import productsRouter from "./routes/products.router.js"; // Importa el enrutador de productos
import cartsRouter from "./routes/carts.router.js"; // Importa el enrutador de carritos

// Crear aplicación express (Iniciar servidor)
const app = express(); // Crea una nueva instancia de la aplicación Express

// Puerto en el que escuchará el servidor
const PORT = 8080; // Define el puerto en el que el servidor escuchará

// Middleware para enviar datos en formato JSON
app.use(express.json()); // Habilita el middleware para parsear datos en formato JSON

// Middleware para enviar datos desde un formulario HTML
app.use(express.urlencoded({ extended: true })); // Habilita el middleware para parsear datos de formularios HTML

// Utilizar el enrutador de productos
app.use("/api/products", productsRouter); // Configura el enrutador de productos en la ruta '/api/products'
// Utilizar el enrutador de carritos
app.use("/api/carts", cartsRouter); // Configura el enrutador de carritos en la ruta '/api/carts'

// Iniciar el servidor (ponerlo a escuchar en el puerto PORT y mostrar un mensaje en consola)
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`); // Muestra un mensaje en la consola cuando el servidor está listo
});
