// Para dependencias no necesito agregar la extensión .js
import express from 'express';
import dotenv from 'dotenv';
import connectarDB from './config/db.js';

// Para dependencias locales si necesito agregar la extensión .js


const app = express();

// Configurar dotenv
dotenv.config();

// Conectar a la base de datos
connectarDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);