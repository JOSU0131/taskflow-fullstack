const express = require('express');
const cors = require('cors');
const miniatureRoutes = require('./routes/miniatures');

const app = express();
const PORT = process.env.PORT || 4000;


// Middlewares globales
app.use(cors()); // Permite que tu React (puerto 5173) hable con este server (puerto 4000)
app.use(express.json()); // Permite recibir datos en formato JSON


// Rutas
app.use('/api/miniatures', miniatureRoutes);

// ESTE ES EL CAMBIO CLAVE:
// Solo ejecutamos app.listen si NO estamos en Vercel (entorno local)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor local en http://localhost:${PORT}`);
    });
}

// Exportamos la app para que Vercel la gestione
module.exports = app;