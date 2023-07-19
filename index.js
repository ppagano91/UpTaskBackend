// Para dependencias no necesito agregar la extensión .js
import express from 'express';

// Para dependencias locales si necesito agregar la extensión .js


const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);