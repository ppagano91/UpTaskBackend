import express from "express";
import {usuarios, registrar} from "../controllers/usuarioController.js";

const router = express.Router();


// Autenticación, Registro y Confirmación de Usuarios

router.get("/", usuarios);
router.post("/", registrar);

router.put("/", (req, res) => {
    res.send("PUT API/USUARIOS");
});

router.delete("/", (req, res) => {
    res.send("DELETE API/USUARIOS");
});

export default router;