import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";
import { Server } from "socket.io";

// Definir __filename y __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear aplicación express
const app = express();
const PORT = 8080;

// Configuración de Express Handlebars
const hbs = create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para enviar datos en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Leer el archivo JSON
const productsFilePath = path.join(__dirname, "data", "products.json");
let products = [];

// Función para leer el archivo JSON y actualizar la variable products
const readProductsFromFile = () => {
  fs.readFile(productsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON", err);
      return;
    }
    try {
      products = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error al parsear el JSON", parseErr);
    }
  });
};

// Leer los productos al iniciar el servidor
readProductsFromFile();

// Rutas (rutas de la API)
app.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

app.get("/productos", (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  const limitedProducts =
    limit && limit > 0 ? products.slice(0, limit) : products;
  res.render("productos", { title: "Productos", products: limitedProducts });
});

app.get("/productos/:pid", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.pid));
  if (product) {
    res.render("product", { title: product.title, product });
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

app.get("/carritos", (req, res) => {
  res.render("carritos", { title: "Carritos" });
});

// Ruta para productos en tiempo real
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en tiempo real" });
});

// Iniciar el servidor - poner a escuchar al servidor en el puerto 8080
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Instancia de socket.io
const io = new Server(httpServer);

// Manejo de conexiones socket.io
io.on("connection", socket => {
  console.log("Un cliente se ha conectado");

  // Enviar listado de productos al cliente
  socket.emit("listado_de_productos", products);

  // Manejar agregar producto
  socket.on("agregarProducto", product => {
    const codeExists = products.some(p => p.code === product.code);
    if (codeExists) {
      socket.emit("mensajeError", "El código del producto ya existe.");
      return;
    }

    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      ...product,
      price: parseFloat(product.price),
      stock: parseInt(product.stock, 10),
      thumbnail: product.thumbnail,
    };
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) {
        console.error("Error al escribir en el archivo JSON", err);
      }
      // Enviar la lista actualizada de productos a todos los clientes
      io.emit("listado_de_productos", products);
    });
  });

  // Manejar eliminar producto
  socket.on("eliminarProducto", id => {
    products = products.filter(p => p.id !== id);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) {
        console.error("Error al escribir en el archivo JSON", err);
      }
      // Enviar la lista actualizada de productos a todos los clientes
      io.emit("listado_de_productos", products);
    });
  });

  // uso de socket.io en el lado del servidor para recibir mensajes del cliente con el método on
  socket.on("mensaje", data => {
    console.log("Mensaje del cliente:", data);
  });
  //para enviar un mensaje desde el front al cliente uso el método emit
  io.emit("mensaje1", "Hola cliente desde el backend");
});
