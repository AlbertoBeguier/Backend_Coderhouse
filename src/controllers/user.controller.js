import userService from "../services/user.service.js";

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age, role } = req.body;
    try {
      const nuevoUsuario = await userService.registerUser({
        first_name,
        last_name,
        email,
        password,
        age,
        role,
      });
      const token = userService.generateToken(nuevoUsuario);

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/sessions/current");
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuario = await userService.loginUser(email, password);
      const token = userService.generateToken(usuario);

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/sessions/current");
    } catch (error) {
      console.error(error);
      res.status(401).send(error.message);
    }
  }

  logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  current(req, res) {
    console.log("Usuario autenticado:", req.user); // depuración
    res.render("home", {
      title: "Home",
      usuario: req.user,
    });
  }

  admin(req, res) {
    console.log("User data in /admin route:", req.user); // depuración
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send(`Acceso denegado! Tu rol actual es: ${req.user.role}`);
    }
    res.render("admin");
  }

  renderRegister(req, res) {
    res.render("register", { title: "Registro" });
  }

  renderLogin(req, res) {
    res.render("login", { title: "Iniciar Sesión" });
  }
}

export default new UserController();
