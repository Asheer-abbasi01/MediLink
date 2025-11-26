const express = require('express');
const router = express.Router();
const praController = require('../controllers/patientRoomAssignmentController');

router.post('/', praController.createAssignment);
router.get('/', praController.getAllAssignments);
router.get('/:id', praController.getAssignmentById);
router.put('/:id', praController.updateAssignment);
router.delete('/:id', praController.deleteAssignment);

module.exports = router;
