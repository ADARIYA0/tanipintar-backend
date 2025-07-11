const express = require('express');
const router = express.Router();

const { createGarden, getUserGarden, deleteGarden, updateGarden } = require('../controllers/gardenController');
const { gardenValidation } = require('../validators/gardenValidator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, gardenValidation, createGarden);
router.get('/', authMiddleware, getUserGarden);
router.delete('/:id', authMiddleware, deleteGarden);
router.put('/:id', authMiddleware, gardenValidation, updateGarden);

module.exports = router;
