import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils/util.js";

class UserService {
  async registerUser(userData) {
    const { first_name, last_name, email, password, age, role } = userData;

    const existeUsuario = await UserModel.findOne({ email });
    if (existeUsuario) {
      throw new Error("El usuario ya existe en nuestra base de datos");
    }

    const nuevoUsuario = new UserModel({
      first_name,
      last_name,
      email,
      password,
      age,
      role: role || "user",
    });

    await nuevoUsuario.save();
    return nuevoUsuario;
  }

  async loginUser(email, password) {
    const usuarioEncontrado = await UserModel.findOne({ email });
    if (!usuarioEncontrado) {
      throw new Error("Usuario no registrado, date una vuelta por el registro");
    }

    if (!isValidPassword(password, usuarioEncontrado)) {
      throw new Error("Contraseña incorrecta");
    }

    return usuarioEncontrado;
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      "palabrasecretaparatoken",
      { expiresIn: "1h" }
    );
  }
}

export default new UserService();
