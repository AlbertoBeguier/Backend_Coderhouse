import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils/util.js";
import database from "../config/database.js";
import UserDTO from "../dto/users.dto.js";

class UserService {
  constructor() {
    database;
  }

  async registerUser(userData) {
    const { first_name, last_name, email, password, age, role } = userData;

    const existeUsuario = await UserModel.findOne({ email });
    if (existeUsuario) {
      throw new Error("El usuario ya existe en nuestra base de datos");
    }

    const userDTO = new UserDTO({
      first_name,
      last_name,
      email,
      age,
      role: role || "user",
    });

    const nuevoUsuario = new UserModel({
      ...userDTO,
      password,
      full_name: userDTO.full_name,
    });

    await nuevoUsuario.save();
    return this.getUserDTO(nuevoUsuario);
  }

  async loginUser(email, password) {
    const usuarioEncontrado = await UserModel.findOne({ email });
    if (!usuarioEncontrado) {
      throw new Error("Usuario no registrado, date una vuelta por el registro");
    }

    if (!isValidPassword(password, usuarioEncontrado)) {
      throw new Error("Contraseña incorrecta");
    }

    return this.getUserDTO(usuarioEncontrado);
  }

  generateToken(user) {
    const userDTO = this.getUserDTO(user);
    return jwt.sign(
      {
        id: userDTO.id,
        email: userDTO.email,
        first_name: userDTO.first_name,
        last_name: userDTO.last_name,
        fullname: userDTO.fullname,
        role: userDTO.role,
      },
      "palabrasecretaparatoken",
      { expiresIn: "1h" }
    );
  }

  getUserDTO(user) {
    return new UserDTO(user);
  }

  async getUserById(userId) {
    const user = await UserModel.findById(userId);
    return user ? this.getUserDTO(user) : null;
  }
}

export default new UserService();
