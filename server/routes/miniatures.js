const express = require('express');
const router = express.Router();
const miniatureController = require('../controllers/miniatureController');

// Definimos las "puertas" de nuestra API (REST)
router.get('/', miniatureController.getAll); 
router.post('/', miniatureController.create);

module.exports = router;