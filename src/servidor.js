import express from "express";
import path from "path";
import "../database.js";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";
import { Server } from "socket.io";
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js";
import realtimeProductRouter from "./routes/realTimeProducts.router.js";
import usuarioRouter from "./routes/usuario.router.js";
import viewsRouter from "./routes/views.router.js";
import { Product } from "./models/products.model.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
initializePassport();

app.use(cookieParser());
app.use(passport.initialize());
const PORT = 8000;

const hbs = create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    multiply: function (a, b) {
      return a * b;
    },
    calculateTotal: function (products) {
      let total = 0;
      products.forEach(function (item) {
        total += item.product.price * item.quantity;
      });
      return total;
    },
    json: function (context) {
      return JSON.stringify(context, null, 2);
    },
    eq: function (v1, v2) {
      return v1 === v2;
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal (página de inicio)
app.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

// Ruta de login
app.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

// Ruta home (requiere autenticación)
app.get(
  "/home",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.render("home", { title: "Home", usuario: req.user });
  }
);

// Rutas para las vistas
app.use("/", productRouter);
app.use("/productos", productRouter);
app.use("/", viewsRouter);

// Rutas para la API JSON
app.use("/api", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", usuarioRouter);

app.use("/realtimeproducts", realtimeProductRouter);
app.use("/carritos", cartRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");

  const products = await Product.find();
  socket.emit("listado_de_productos", products);

  socket.on("agregarProducto", async (product) => {
    try {
      const lastProduct = await Product.findOne().sort({ id: -1 });
      const newId = lastProduct ? lastProduct.id + 1 : 1;

      const newProduct = new Product({
        id: newId,
        ...product,
      });

      await newProduct.save();
      const updatedProducts = await Product.find();
      io.emit("listado_de_productos", updatedProducts);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  });

  socket.on("eliminarProducto", async (id) => {
    try {
      const productId = new mongoose.Types.ObjectId(id);
      await Product.findByIdAndDelete(productId);
      const updatedProducts = await Product.find();
      io.emit("listado_de_productos", updatedProducts);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  });

  socket.on("mensaje", (data) => {
    console.log("Mensaje del cliente:", data);
  });

  io.emit("mensaje1", "Hola cliente desde el backend");
});

hbs.handlebars.registerHelper("multiply", function (a, b) {
  return a * b;
});

export default app;
