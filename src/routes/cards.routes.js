const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');

router.get('/cards', cardController.getAllCards);
router.get('/cards/:id', cardController.getCardById);
router.get('/cards/name/:name', cardController.getCardByName);
router.post('/cards', cardController.postCard);
router.put('/cards/:id', cardController.putCard);
router.delete('/cards/:id', cardController.deleteCard);

module.exports = router;