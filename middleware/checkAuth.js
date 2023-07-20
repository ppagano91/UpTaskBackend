import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // verify() decodifica el token y verifica que sea válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.uid).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );
      //   console.log("req.usuario:", req.usuario);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Token no válido" });
    }
  }
  if (!token) {
    const error = new Error("No se ha enviado un token");
    return res.status(401).json({ msg: error.message });
  }
  next();
};
export default checkAuth;
