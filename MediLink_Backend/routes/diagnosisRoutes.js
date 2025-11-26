const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');

router.post('/', diagnosisController.createDiagnosis);
router.get('/', diagnosisController.getAllDiagnosis);
router.get('/:id', diagnosisController.getDiagnosisById);
router.put('/:id', diagnosisController.updateDiagnosis);
router.delete('/:id', diagnosisController.deleteDiagnosis);

module.exports = router;
