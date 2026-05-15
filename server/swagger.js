// Configuración de Swagger / OpenAPI 3.0 para HammerFlow Forge
// Documenta los endpoints de la API automáticamente leyendo los comentarios
// JSDoc de routes/*.js

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HammerFlow Forge API',
            version: '1.0.0',
            description:
                'API REST del marketplace de miniaturas, mecenazgos y tutoriales. ' +
                'Devuelve items de tipo VENTA, MECENAZGO o TUTORIAL ' +
                '(unión discriminada en TypeScript).',
            contact: {
                name: 'Josu — HammerFlow Forge'
            }
        },
        servers: [
            { url: 'http://localhost:4000', description: 'Local' },
            { url: '/', description: 'Producción (mismo origen)' }
        ],
        components: {
            schemas: {
                BaseItem: {
                    type: 'object',
                    required: ['id', 'titulo', 'autor', 'imagen', 'categoria'],
                    properties: {
                        id: { type: 'string', example: '1' },
                        titulo: { type: 'string', example: 'Guerrero del Caos' },
                        autor: { type: 'string', example: 'Archaon_Paints' },
                        imagen: { type: 'string', format: 'uri' },
                        categoria: {
                            type: 'string',
                            enum: ['Fantasía', 'Bustos', 'WIPS', 'Monstruos', 'Tutorial Pintado', 'Tutorial Esculpido', 'Otros']
                        }
                    }
                },
                ItemVenta: {
                    allOf: [
                        { $ref: '#/components/schemas/BaseItem' },
                        {
                            type: 'object',
                            required: ['tipo', 'precio', 'stock'],
                            properties: {
                                tipo: { type: 'string', enum: ['VENTA'] },
                                precio: { type: 'number', example: 50 },
                                stock: { type: 'integer', example: 1 }
                            }
                        }
                    ]
                },
                ItemMecenazgo: {
                    allOf: [
                        { $ref: '#/components/schemas/BaseItem' },
                        {
                            type: 'object',
                            required: ['tipo', 'meta', 'recaudado', 'fechaFin'],
                            properties: {
                                tipo: { type: 'string', enum: ['MECENAZGO'] },
                                meta: { type: 'number', example: 5000 },
                                recaudado: { type: 'number', example: 3200 },
                                fechaFin: { type: 'string', format: 'date', example: '2026-08-30' }
                            }
                        }
                    ]
                },
                ItemTutorial: {
                    allOf: [
                        { $ref: '#/components/schemas/BaseItem' },
                        {
                            type: 'object',
                            required: ['tipo', 'precio', 'duracion', 'nivel'],
                            properties: {
                                tipo: { type: 'string', enum: ['TUTORIAL'] },
                                precio: { type: 'number', example: 20 },
                                duracion: { type: 'string', example: '2 horas' },
                                nivel: { type: 'string', enum: ['Básico', 'Intermedio', 'Avanzado'] }
                            }
                        }
                    ]
                },
                HammerItem: {
                    oneOf: [
                        { $ref: '#/components/schemas/ItemVenta' },
                        { $ref: '#/components/schemas/ItemMecenazgo' },
                        { $ref: '#/components/schemas/ItemTutorial' }
                    ]
                },
                HammerItemInput: {
                    description: 'Igual que HammerItem pero sin id (lo genera el servidor)',
                    oneOf: [
                        { $ref: '#/components/schemas/ItemVenta' },
                        { $ref: '#/components/schemas/ItemMecenazgo' },
                        { $ref: '#/components/schemas/ItemTutorial' }
                    ]
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(swaggerOptions);
