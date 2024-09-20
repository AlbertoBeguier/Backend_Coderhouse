import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart", // Modelo de carritos
  },
  role: {
    type: String,
    default: "user",
  },
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = bcrypt.hashSync(this.password, 10); // 10 es el número de saltos para la encriptación
  }
  next();
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
