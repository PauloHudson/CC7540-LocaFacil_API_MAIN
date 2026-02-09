const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// User 
router.post('/', authMiddleware, rentalController.create);
router.get('/user/my-rentals', authMiddleware, rentalController.getUserRentals);
router.get('/:id', authMiddleware, rentalController.getById);
router.post('/:id/payment', authMiddleware, rentalController.processPayment);
router.post('/:id/cancel', authMiddleware, rentalController.cancelRental);

// Admin 
router.get('/', authMiddleware, adminMiddleware, rentalController.getAllRentals);

module.exports = router;
