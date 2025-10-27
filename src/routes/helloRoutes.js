const express = require('express');
const { helloController } = require('../controllers/helloController');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna un mensaje de bienvenida
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Mensaje exitoso
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World from Clean Architecture!
 */
router.get('/', helloController);

module.exports = router;