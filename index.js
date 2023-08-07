// Para dependencias no necesito agregar la extensión .js
import express from "express";
import dotenv from "dotenv";
import connectarDB from "./config/db.js";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

// CORS
import cors from "cors";

// Para dependencias locales si necesito agregar la extensión .js

const app = express();

// Para procesar y leer el body que viene en formato JSON
app.use(express.json());

// Configurar dotenv
dotenv.config();

// Conectar a la base de datos
connectarDB();

// Configurar CORS

const whiteList = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2]; // Lista de dominios permitidos

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No puede consultar la API
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2],
  },
});

io.on("connection", (socket) => {
  console.log("Conectado a socket.io: ", socket.id);

  // Definir los eventos de socket io
  socket.on("abrir-proyecto", (id) => {
    socket.join(id);

    socket
      .to(id)
      .emit("respuesta", { respuesta: "respuesta desde el servidor" });
  });

  // socket.on("disconnect", () => {
  //   console.log("Cliente desconectado: ", socket.id);
  // });
});
