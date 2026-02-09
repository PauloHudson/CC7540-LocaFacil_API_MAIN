const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', vehicleController.getAll);
router.get('/available', vehicleController.getAvailable);
router.get('/:id', vehicleController.getById);

// Admin 
router.post('/', authMiddleware, adminMiddleware, vehicleController.create);
router.put('/:id', authMiddleware, adminMiddleware, vehicleController.update);
router.delete('/:id', authMiddleware, adminMiddleware, vehicleController.delete);

module.exports = router;
