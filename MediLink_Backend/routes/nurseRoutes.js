const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');

router.post('/', nurseController.createNurse);
router.get('/', nurseController.getAllNurses);
router.get('/:id', nurseController.getNurseById);
router.put('/:id', nurseController.updateNurse);
router.delete('/:id', nurseController.deleteNurse);

module.exports = router;
