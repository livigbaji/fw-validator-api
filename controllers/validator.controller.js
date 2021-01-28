const Validator = require('../lib/validator');


module.exports = class {
    static checkPayload(req, res, next){
        const { data, rule } = req.body || {};

        if (!rule) {
            return res.status(400).errorMessage('rule is required.');
        }

        if (!(typeof rule === 'object' && !Array.isArray(rule))) {
            return res.status(400).errorMessage('rule should be an object.');
        }

        if(!data) {
            return res.status(400).errorMessage('data is required.');
        }

        next();
    }

    static validateRulesField(req, res, next) {
        const { rule } = req.body;

        if(!rule.field) {
            return res.status(400).errorMessage('rule must have a \'field\' field.');
        }

        if (!rule.condition) {
            return res.status(400).errorMessage('rule must have a \'condition\' field.');
        }

        const validConditions = ['eq', 'neq', 'gte', 'gt', 'contains'];

        if(!validConditions.includes(rule.condition)) {
            return res.status(400).errorMessage(`rule condition field must be one of ${validConditions.slice(0, -1).join(', ')} or ${validConditions.slice(-1)}.`);
        }

        if (!rule.condition_value) {
            return res.status(400).errorMessage('rule must have a \'condition_value\' field.');
        }

        next();
    }

    static dataFieldExists(req, res, next) {
        const { rule: { field }, data } = req.body;
        
        if((typeof data === 'string' || Array.isArray(data)) && field !== '0') {
            return res.status(400).errorMessage(`field ${field} is missing from data.`);
        }

        if(typeof data === 'object' && !data[field]) {
            return res.status(400).errorMessage(`field ${field} is missing from data.`);
        }

        next();
    }

    static validate(req, res, next) {
        const { rule: { condition, condition_value: conditionValue, field }, data } = req.body;

        const fieldValue = Validator.extractFieldValue(data, field);

        if(!Validator.validate({ condition, field: fieldValue, conditionValue})){
            return res.status(400).error({
                validation: {
                    error: true,
                    field,
                    field_value: fieldValue,
                    condition,
                    condition_value: conditionValue
                }
            }, `field ${field} failed validation.`);
        }

        next();
    }

    static respond(req, res, next) {
        const { rule: { condition, condition_value, field }, data } = req.body;
        
        const fieldValue = Validator.extractFieldValue(data, field);

        res.data({
            validation: {
                 error: false,
                 field,
                 field_value: fieldValue,
                 condition,
                 condition_value
            }
        }, `field ${field} successfully validated.`);
    }
};