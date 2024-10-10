import express from "express";
import path from "path";
import "./config/database.js";
import { fileURLToPath } from "url";
import { create } from "express-handlebars";
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js";
import realtimeProductRouter from "./routes/realTimeProducts.router.js";
import usuarioRouter from "./routes/usuario.router.js";
import viewsRouter from "./routes/views.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import { configureSocket } from "./config/socket.js";

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

// Rutas
app.get("/", (req, res) => {
  res.render("index", { title: "Inicio" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

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

app.use("/", productRouter);
app.use("/productos", productRouter);
app.use("/", viewsRouter);
app.use("/api", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", usuarioRouter);
app.use("/realtimeproducts", realtimeProductRouter);
app.use("/carritos", cartRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = configureSocket(httpServer);

export default app;
