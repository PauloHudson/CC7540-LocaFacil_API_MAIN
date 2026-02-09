const express = require('express');
const router = express.Router();
const electronicController = require('../controllers/electronicController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', electronicController.getAll);
router.get('/available', electronicController.getAvailable);
router.get('/:id', electronicController.getById);

// Admin 
router.post('/', authMiddleware, adminMiddleware, electronicController.create);
router.put('/:id', authMiddleware, adminMiddleware, electronicController.update);
router.delete('/:id', authMiddleware, adminMiddleware, electronicController.delete);

module.exports = router;
