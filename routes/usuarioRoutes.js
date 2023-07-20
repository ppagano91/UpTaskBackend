import express from "express";
import {
  usuarios,
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Autenticación, Registro y Confirmación de Usuarios

router.get("/", usuarios);
router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/recuperar-password", recuperarPassword);
/*
Otra forma de hacerlo:
router.route("/recuperar-password/:token").get(comprobarToken).post(nuevoPassword);
*/
router.get("/recuperar-password/:token", comprobarToken);
router.post("/recuperar-password/:token", nuevoPassword);

// Proteger ruta /perfil con un middleware
router.get("/perfil", checkAuth, perfil);

router.put("/", (req, res) => {
  res.send("PUT API/USUARIOS");
});

router.delete("/", (req, res) => {
  res.send("DELETE API/USUARIOS");
});

export default router;
