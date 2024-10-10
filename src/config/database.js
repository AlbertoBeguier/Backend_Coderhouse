import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Conexión a la base de datos MongoDB establecida");
      })
      .catch((err) => {
        console.error("Error al conectar a la base de datos", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();

export default instance;
