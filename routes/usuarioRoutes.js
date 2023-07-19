import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("GET API/USUARIOS");
});

router.post("/", (req, res) => {
    res.send("POST API/USUARIOS");
});

router.put("/", (req, res) => {
    res.send("PUT API/USUARIOS");
});

router.delete("/", (req, res) => {
    res.send("DELETE API/USUARIOS");
});

export default router;