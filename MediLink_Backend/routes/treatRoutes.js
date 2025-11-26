const express = require('express');
const router = express.Router();
const treatsController = require('../controllers/treatController');

router.post('/', treatsController.createTreat);
router.get('/', treatsController.getAllTreats);
router.get('/:id', treatsController.getTreatById);
router.put('/:id', treatsController.updateTreat);
router.delete('/:id', treatsController.deleteTreat);

module.exports = router;
