// Para dependencias no necesito agregar la extensión .js
import express from 'express';
import dotenv from 'dotenv';
import connectarDB from './config/db.js';

import usuarioRoutes from './routes/usuarioRoutes.js';

// Para dependencias locales si necesito agregar la extensión .js


const app = express();

// Para procesar y leer el body que viene en formato JSON
app.use(express.json());

// Configurar dotenv
dotenv.config();

// Conectar a la base de datos
connectarDB();

// Routing
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

app.use('/api/usuarios',usuarioRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);