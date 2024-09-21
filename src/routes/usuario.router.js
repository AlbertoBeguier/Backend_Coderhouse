import { Router } from "express";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";

const router = Router();

// Registro
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age, role } = req.body;

  try {
    const existeUsuario = await UserModel.findOne({ email });

    if (existeUsuario) {
      return res
        .status(400)
        .send("El usuario ya existe en nuestra base de datos");
    }

    const nuevoUsuario = new UserModel({
      first_name,
      last_name,
      email,
      password: createHash(password), // encripta la contraseña
      age,
      role: role || "user",
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        first_name: nuevoUsuario.first_name,
        last_name: nuevoUsuario.last_name,
        role: nuevoUsuario.role,
      },
      "palabrasecretaparatoken",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("coderCookieToken", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuarioEncontrado = await UserModel.findOne({ email });

    if (!usuarioEncontrado) {
      return res
        .status(401)
        .send("Usuario no registrado, date una vuelta por el registro");
    }

    if (!isValidPassword(password, usuarioEncontrado)) {
      return res.status(401).send("Contraseña incorrecta");
    }

    const token = jwt.sign(
      {
        id: usuarioEncontrado._id,
        email: usuarioEncontrado.email,
        first_name: usuarioEncontrado.first_name,
        last_name: usuarioEncontrado.last_name,
        role: usuarioEncontrado.role,
      },
      "palabrasecretaparatoken",
      { expiresIn: "1h" }
    );

    res.cookie("coderCookieToken", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    res.redirect("/api/sessions/current");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/login");
});

// Current User
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    console.log("Usuario autenticado:", req.user); // depuración
    res.render("home", {
      title: "Home",
      usuario: req.user, // pasar directamente req.user sin modificaciones
    });
  }
);

// Rutas de vistas
router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// Admin
router.get(
  "/admin",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    console.log("User data in /admin route:", req.user); // Añadimos esta línea para depuración
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send(`Acceso denegado! Tu rol actual es: ${req.user.role}`);
    }
    res.render("admin");
  }
);

export default router;
