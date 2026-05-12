const express = require('express');
const router = express.Router();
const miniatureController = require('../controllers/miniatureController');

/**
 * @openapi
 * /api/miniatures:
 *   get:
 *     summary: Lista todas las miniaturas
 *     tags: [Miniatures]
 *     responses:
 *       200:
 *         description: Array de miniaturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HammerItem'
 *   post:
 *     summary: Crea una nueva miniatura (VENTA, MECENAZGO o TUTORIAL)
 *     tags: [Miniatures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HammerItemInput'
 *     responses:
 *       201:
 *         description: Miniatura creada
 *       400:
 *         description: Datos inválidos
 *
 * /api/miniatures/{id}:
 *   get:
 *     summary: Obtiene una miniatura por id
 *     tags: [Miniatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Miniatura encontrada
 *       404:
 *         description: No existe
 *   put:
 *     summary: Actualiza una miniatura existente
 *     tags: [Miniatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HammerItemInput'
 *     responses:
 *       200:
 *         description: Miniatura actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No existe
 *   delete:
 *     summary: Elimina una miniatura
 *     tags: [Miniatures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminada correctamente
 *       404:
 *         description: No existe
 */
router.get('/', miniatureController.getAll);
router.get('/:id', miniatureController.getById);
router.post('/', miniatureController.create);
router.put('/:id', miniatureController.update);
router.delete('/:id', miniatureController.delete);

module.exports = router;
