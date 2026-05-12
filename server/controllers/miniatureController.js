// Datos en memoria. En un proyecto real, esto vendría de una base de datos.
let miniatures = [
    {
        id: '1',
        tipo: 'VENTA',
        titulo: 'Guerrero del Caos - Edición Limitada',
        autor: 'Archaon_Paints',
        imagen: 'https://images.unsplash.com/photo-1613431812949-77b3351bb23d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWluaWF0dXJlfGVufDB8fDB8fHww',
        categoria: 'Fantasía',
        precio: 50,
        stock: 1
    },
    {
        id: '2',
        tipo: 'MECENAZGO',
        titulo: 'Dragon ancestral - Proyecto de Esculpido',
        autor: 'ForgeMaster',
        imagen: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcREO8WMD_flijDB-e6TMqsrxBu7rAaEDL7RyAh0UGpzqhuevNsX7QhKWGf4Mh7N',
        categoria: 'Fantasía',
        meta: 5000,
        recaudado: 3200,
        fechaFin: '2026-08-30'
    },
    {
        id: '3',
        tipo: 'TUTORIAL',
        titulo: 'Tutorial de Pintura Avanzada',
        autor: 'Archaon_Paints',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJ-2hyv3q-EsXVqKAfPFTaWqXgrKIvKVh52KvD8jAmOpF7ffaMmlqOuknU6SL',
        categoria: 'Tutorial Pintado',
        duracion: '2 horas',
        nivel: 'Intermedio',
        precio: 20
    }
];

/**
 * Validación específica por TIPO de item.
 * Devuelve null si todo OK, o un string con el mensaje de error.
 *
 * NOTA (bitácora): Antes el controller validaba `nombre` y `precio`, pero el
 * frontend envía `titulo` (alineado con la interfaz BaseItem). Esto causaba
 * que TODA petición POST devolviese 400. Bug arreglado en este refactor.
 */
const validarMiniatura = (data) => {
    const { tipo, titulo, autor, imagen, categoria } = data;

    // Campos comunes (BaseItem)
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
        return 'El título es obligatorio y debe tener al menos 3 caracteres';
    }
    if (!autor || typeof autor !== 'string') {
        return 'El autor es obligatorio';
    }
    if (!imagen || typeof imagen !== 'string') {
        return 'La URL de imagen es obligatoria';
    }
    if (!categoria || typeof categoria !== 'string') {
        return 'La categoría es obligatoria';
    }

    // Campos específicos según tipo (Unión Discriminada)
    switch (tipo) {
        case 'VENTA':
            if (typeof data.precio !== 'number' || data.precio <= 0) {
                return 'El precio debe ser un número mayor que 0';
            }
            if (typeof data.stock !== 'number' || data.stock < 0) {
                return 'El stock debe ser un número igual o mayor que 0';
            }
            return null;

        case 'MECENAZGO':
            if (typeof data.meta !== 'number' || data.meta <= 0) {
                return 'La meta de recaudación debe ser un número mayor que 0';
            }
            if (typeof data.recaudado !== 'number' || data.recaudado < 0) {
                return 'Lo recaudado debe ser un número igual o mayor que 0';
            }
            if (!data.fechaFin || isNaN(Date.parse(data.fechaFin))) {
                return 'La fecha fin debe ser una fecha válida en formato ISO';
            }
            return null;

        case 'TUTORIAL':
            if (typeof data.precio !== 'number' || data.precio <= 0) {
                return 'El precio debe ser un número mayor que 0';
            }
            if (!data.duracion || typeof data.duracion !== 'string') {
                return 'La duración es obligatoria (ej: "2 horas")';
            }
            if (!['Básico', 'Intermedio', 'Avanzado'].includes(data.nivel)) {
                return 'El nivel debe ser Básico, Intermedio o Avanzado';
            }
            return null;

        default:
            return 'El tipo debe ser VENTA, MECENAZGO o TUTORIAL';
    }
};

const miniatureController = {
    // GET /api/miniatures - Lista completa (200)
    getAll: (req, res) => {
        res.status(200).json(miniatures);
    },

    // GET /api/miniatures/:id - Detalle por id (200 o 404)
    getById: (req, res) => {
        const { id } = req.params;
        const item = miniatures.find(m => m.id === id);
        if (!item) {
            return res.status(404).json({ message: `No existe ninguna pieza con id ${id}` });
        }
        res.status(200).json(item);
    },

    // POST /api/miniatures - Crear (201 o 400)
    create: (req, res) => {
        const errorMsg = validarMiniatura(req.body);
        if (errorMsg) {
            return res.status(400).json({ message: errorMsg });
        }
        const nuevaMini = { id: Date.now().toString(), ...req.body };
        miniatures.push(nuevaMini);
        res.status(201).json(nuevaMini);
    },

    // PUT /api/miniatures/:id - Editar (200, 400 o 404)
    update: (req, res) => {
        const { id } = req.params;
        const index = miniatures.findIndex(m => m.id === id);
        if (index === -1) {
            return res.status(404).json({ message: 'No existe esa pieza' });
        }
        // Combinamos lo viejo con lo nuevo y validamos el resultado completo
        const fusionado = { ...miniatures[index], ...req.body };
        const errorMsg = validarMiniatura(fusionado);
        if (errorMsg) {
            return res.status(400).json({ message: errorMsg });
        }
        miniatures[index] = fusionado;
        res.status(200).json(miniatures[index]);
    },

    // DELETE /api/miniatures/:id - Eliminar (200 o 404)
    delete: (req, res) => {
        const { id } = req.params;
        const existe = miniatures.some(m => m.id === id);
        if (!existe) {
            return res.status(404).json({ message: 'No se puede borrar lo que no existe' });
        }
        miniatures = miniatures.filter(m => m.id !== id);
        res.status(200).json({ message: 'Pieza eliminada', id });
    }
};

module.exports = miniatureController;
