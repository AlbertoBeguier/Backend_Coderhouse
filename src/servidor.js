import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";

// Definir __dirname manualmente
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
  res.render("productos", { title: "Productos", products });
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

// Iniciar el servidor - poner a escuchar al servidor en el puerto 8080
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
