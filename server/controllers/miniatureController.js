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
    fechaFin: '2026-05-30'
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