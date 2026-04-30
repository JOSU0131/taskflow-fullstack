let miniatures = []; 

const miniatureController = {
    // GET - Obtener todas (200)
    getAll: (req, res) => {
        res.status(200).json(miniatures);
    },

    // POST - Crear nueva (201 o 400)
    create: (req, res) => {
        const { nombre, precio } = req.body;
        if (!nombre || !precio) {
            return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
        }
        const nuevaMini = { id: Date.now().toString(), ...req.body };
        miniatures.push(nuevaMini);
        res.status(201).json(nuevaMini);
    },

    // PUT - Editar pieza existente (200 o 404)
    update: (req, res) => {
        const { id } = req.params;
        const index = miniatures.findIndex(m => m.id === id);
        if (index === -1) return res.status(404).json({ message: 'No existe esa pieza' });

        miniatures[index] = { ...miniatures[index], ...req.body };
        res.status(200).json(miniatures[index]);
    },

    // DELETE - Eliminar pieza (200 o 404)
    delete: (req, res) => {
        const { id } = req.params;
        const existe = miniatures.some(m => m.id === id);
        if (!existe) return res.status(404).json({ message: 'No se puede borrar lo que no existe' });

        miniatures = miniatures.filter(m => m.id !== id);
        res.status(200).json({ message: 'Pieza eliminada' });
    }
};

module.exports = miniatureController;