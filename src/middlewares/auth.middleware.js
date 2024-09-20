import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.coderCookieToken;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, "palabrasecretaparatoken");
    req.user = decoded;
    console.log("Usuario autenticado:", req.user); // Añade este log
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.clearCookie("coderCookieToken");
    return res.redirect("/login");
  }
};
