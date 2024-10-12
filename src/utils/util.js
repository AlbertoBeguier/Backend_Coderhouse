import bcrypt from "bcrypt";

const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

export { isValidPassword };
