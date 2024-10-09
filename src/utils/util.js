import bcrypt from "bcrypt";

// Comparar la contraseña ingresada con la contraseña hasheada del usuario (en login o autenticación)
const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export { isValidPassword };
