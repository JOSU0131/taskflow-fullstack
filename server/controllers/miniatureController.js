// Simulamos una base de datos temporal[cite: 4]
let miniatures = []; 

const miniatureController = {
    getAll: (req, res) => {
        // Código 200: Éxito al leer[cite: 4]
        res.status(200).json(miniatures);
    },
    create: (req, res) => {
        const nuevaMini = { id: Date.now().toString(), ...req.body };
        miniatures.push(nuevaMini);
        // Código 201: Creado con éxito[cite: 4]
        res.status(201).json(nuevaMini);
    }
};

module.exports = miniatureController;