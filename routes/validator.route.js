const router = require('express').Router();
const ValidatorController = require('../controllers/validator.controller');

router.post(
        '/', 
        ValidatorController.checkPayload,
        ValidatorController.validateRulesField,
        ValidatorController.dataFieldExists,
        ValidatorController.validate, 
        ValidatorController.respond
    );

module.exports = router;