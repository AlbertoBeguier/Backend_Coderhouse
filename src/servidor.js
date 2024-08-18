import express from "express";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";
import { Server } from "socket.io";
import cartRouter from "./routes/carts.router.js"; // Importa el router de carritos
import { Cart } from "./models/carts.model.js"; // Importa el modelo de carrito
import { Product } from "./models/products.model.js"; // Importa el modelo de productos

// Definir __filename y __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear aplicación express
const app = express();
const PORT = 8080;

// Conectar a MongoDB usando Mongoose
mongoose.connect("mongodb+srv://aabeguier:5279167134@clustercoder.kzn29.mongodb.net/ProyectoCoder?retryWrites=true&w=majority&appName=ClusterCoder", {
 
})
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

// Configuración de Express Handlebars con opción para permitir acceso a propiedades heredadas
const hbs = create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para enviar datos en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas (rutas de la API)
app.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

app.get("/productos", async (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  try {
    const products = await Product.find().limit(limit > 0 ? limit : undefined);
    res.render("productos", { title: "Productos", products });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});

app.get("/productos/:pid", async (req, res) => {
  try {
    // En lugar de buscar por _id de MongoDB, busca por el campo `id` numérico
    const product = await Product.findOne({ id: parseInt(req.params.pid) });
    if (product) {
      res.render("product", { title: product.title, product });
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).send("Error al obtener producto");
  }
});
app.get("/carritos", async (req, res) => {
  try {
    const carritos = await Cart.find().populate('products.product');
    res.render("carritos", { title: "Carritos", carritos });
  } catch (err) {
    console.error("Error al obtener carritos:", err);
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});

// Ruta para productos en tiempo real
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en tiempo real" });
});

// Usar el router de carritos
app.use("/api/carritos", cartRouter);

// Iniciar el servidor - poner a escuchar al servidor en el puerto 8080
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Instancia de socket.io
const io = new Server(httpServer);

// Manejo de conexiones socket.io
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");

  // Enviar listado de productos al cliente
  const products = await Product.find();
  console.log(`Productos enviados al cliente: ${products.length}`);
  socket.emit("listado_de_productos", products);

  // Manejar agregar producto
  socket.on("agregarProducto", async (product) => {
    try {
      // Obtener el valor máximo actual de `id` en la base de datos
      const lastProduct = await Product.findOne().sort({ id: -1 });
      const newId = lastProduct ? lastProduct.id + 1 : 1;

      const newProduct = new Product({
        id: newId, // Asignar el nuevo `id`
        ...product,
      });

      console.log("Producto recibido en el servidor:", newProduct); // Log para verificar el producto antes de guardar
      await newProduct.save();

      const updatedProducts = await Product.find();
      io.emit("listado_de_productos", updatedProducts);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  });

  // Manejar eliminar producto
  socket.on("eliminarProducto", async (id) => {
    try {
      const productId = new mongoose.Types.ObjectId(id); // Usa 'new' aquí
      await Product.findByIdAndDelete(productId);
      const updatedProducts = await Product.find();
      io.emit("listado_de_productos", updatedProducts);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  });

  // Recibir mensajes del cliente
  socket.on("mensaje", (data) => {
    console.log("Mensaje del cliente:", data);
  });

  // Enviar mensaje al cliente
  io.emit("mensaje1", "Hola cliente desde el backend");
});

hbs.handlebars.registerHelper('multiply', function (a, b) {
  return a * b;
});
