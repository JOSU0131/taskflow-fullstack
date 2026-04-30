const express = require('express');
const router = express.Router();
const miniatureController = require('../controllers/miniatureController');

// Definimos las "puertas" de nuestra API (REST)
router.get('/', miniatureController.getAll); 
router.post('/', miniatureController.create);
router.put('/:id', miniatureController.update);    // NUEVA
router.delete('/:id', miniatureController.delete); // NUEVA

module.exports = router;