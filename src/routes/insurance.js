const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', insuranceController.getAll);
router.get('/:id', insuranceController.getById);

// Admin 
router.post('/', authMiddleware, adminMiddleware, insuranceController.create);
router.put('/:id', authMiddleware, adminMiddleware, insuranceController.update);

module.exports = router;
