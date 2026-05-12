const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const miniatureRoutes = require('./routes/miniatures');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors()); // Permite que React (puerto 5173) hable con este server (puerto 4000)
app.use(express.json()); // Permite recibir datos en formato JSON

// Documentación interactiva de la API en /api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'HammerFlow Forge API'
}));
// JSON puro de la spec por si alguien lo quiere consumir desde fuera
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// Rutas de la API
app.use('/api/miniatures', miniatureRoutes);

// Ruta raíz (útil para comprobar que el servidor responde)
app.get('/api', (req, res) => {
    res.json({
        name: 'HammerFlow Forge API',
        docs: '/api/docs',
        endpoints: {
            list: 'GET /api/miniatures',
            detail: 'GET /api/miniatures/:id',
            create: 'POST /api/miniatures',
            update: 'PUT /api/miniatures/:id',
            delete: 'DELETE /api/miniatures/:id'
        }
    });
});

// Solo arrancamos el server local fuera de producción (Vercel lo gestiona)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor local en http://localhost:${PORT}`);
        console.log(`📚 Docs en http://localhost:${PORT}/api/docs`);
    });
}

module.exports = app;
