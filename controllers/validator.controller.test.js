const { mockNext, mockRequest, mockResponse } = require('../__mocks__/http');
const ValidatorController = require('./validator.controller');
const Validator = require('../lib/validator');

describe('Validator Controller', () => {
    describe('checkPayload method', () => {
       test('Requires the rule field in request body for empty body', () => {
           const req = mockRequest({ body: null });
           const res = mockResponse();

           ValidatorController.checkPayload(req, res, mockNext);

           expect(res.status).toBeCalledWith(400);
           expect(res.errorMessage).toBeCalledWith('rule is required.');
       });

       test('Requires the rule field in request body for body with data only', () => {
           const req = mockRequest({ body: { data: 'hello' } });
           const res = mockResponse();

           ValidatorController.checkPayload(req, res, mockNext);

           expect(res.status).toBeCalledWith(400);
           expect(res.errorMessage).toBeCalledWith('rule is required.');
       });
       
        test('Requires the rule field to be valid object', () => {
            const req = mockRequest({
                body: {
                    data: 'hello',
                    rule: 'jibberish'
                }
            });
            const res = mockResponse();

            ValidatorController.checkPayload(req, res, mockNext);

            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalledWith('rule should be an object.');
        });

        test('Requires the data field to be in request body', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        valid: 'object'
                    }
                }
            });
            const res = mockResponse();

            ValidatorController.checkPayload(req, res, mockNext);

            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalledWith('data is required.');
        });

        
        test('Adding rule and data field to request body passes validation', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        valid: 'object'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();
            const next = jest.fn();

            ValidatorController.checkPayload(req, res, next);

            expect(next).toBeCalled();
        });
    });


    describe('validateRulesField Method', () => {
        test('rule field requires field sub-field', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        condition: 'eq',
                        condition_value: 'stuff'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();

            ValidatorController.validateRulesField(req, res, mockNext);
            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalled();
        });

        test('rule field requires condition sub-field', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: '0',
                        condition_value: 'stuff'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();

            ValidatorController.validateRulesField(req, res, mockNext);
            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalled();
        });

        test('rule field requires condition_value sub-field', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: '0',
                        condition: 'eq'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();

            ValidatorController.validateRulesField(req, res, mockNext);
            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalled();
        });

        test('invalid condition sub-field throws error', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: '0',
                        condition: 'rt',
                        condition_value: 'stuff'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();

            ValidatorController.validateRulesField(req, res, mockNext);
            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalled();
        });

        test('complete rule sub-fields passes validation', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: '0',
                        condition: 'gt',
                        condition_value: 'stuff'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();
            const next = jest.fn();

            ValidatorController.validateRulesField(req, res, next);
            expect(next).toBeCalled();
        });
    });


    describe('dataFieldExists Method', () => {
        test('rule field property has to be \'0\' for non-object data', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: '5',
                        condition: 'gt',
                        condition_value: 'stuff'
                    },
                    data: 'stuff'
                }
            });
            const res = mockResponse();

            ValidatorController.dataFieldExists(req, res, mockNext);
            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalledWith('field 5 is missing from data.');
        });

        test('rule field property has to be object key in data field object', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: 'hello',
                        condition: 'gt',
                        condition_value: 'stuff'
                    },
                    data: {
                        hi: 'oops'
                    }
                }
            });
            const res = mockResponse();

            ValidatorController.dataFieldExists(req, res, mockNext);
            expect(res.status).toBeCalledWith(400);
            expect(res.errorMessage).toBeCalledWith('field hello is missing from data.');
        });

        test('validation passes if rule data is valid and corresponds with rule', () => {
            const req = mockRequest({
                body: {
                    rule: {
                        field: 'hello',
                        condition: 'gt',
                        condition_value: 'stuff'
                    },
                    data: {
                        hello: 'oops'
                    }
                }
            });
            const res = mockResponse();
            const next = jest.fn();

            ValidatorController.dataFieldExists(req, res, next);
            expect(next).toBeCalled();
        });
    });

    describe('validate Method', () => {
        test('Passing validation invokes next', () => {
            const condition = 'eq';
            const conditionValue = 'stuff';
            const fieldValue = 'stuff';
            const field = '0';

            const req = mockRequest({
                body: {
                    rule: {
                        field,
                        condition,
                        condition_value: conditionValue
                    },
                    data: fieldValue
                }
            });
            const res = mockResponse();
            const next = jest.fn();

            const validatorSpy = jest.spyOn(Validator, 'validate');
            validatorSpy.mockReturnValue(true);

            ValidatorController.validate(req, res, next);
            expect(validatorSpy).toBeCalledWith({ condition, field: fieldValue, conditionValue });
            expect(next).toBeCalled();
        });

        test('Failing validation returns error', () => {
            const condition = 'eq';
            const conditionValue = 'stuff';
            const fieldValue = 'oops';
            const field = 'hello';

            const req = mockRequest({
                body: {
                    rule: {
                        field,
                        condition,
                        condition_value: conditionValue
                    },
                    data: {
                        [field]: fieldValue
                    }
                }
            });
            const res = mockResponse();

            const validatorSpy = jest.spyOn(Validator, 'validate');
            validatorSpy.mockReturnValue(false);

            ValidatorController.validate(req, res, mockNext);
            expect(validatorSpy).toBeCalledWith({
                condition,
                field: fieldValue,
                conditionValue
            });
            expect(res.status).toBeCalledWith(400);
            expect(res.error).toBeCalledWith({
                validation: {
                    error: true,
                    field,
                    field_value: fieldValue,
                    condition,
                    condition_value: conditionValue
                }
            }, `field ${field} failed validation.`);
        });
    });

    describe('respond Method', () => {
        test('Sends success message', () => {
            const condition = 'eq';
            const conditionValue = 'stuff';
            const fieldValue = 'stuff';
            const field = 'hello';
    
            const req = mockRequest({
                body: {
                    rule: {
                        field,
                        condition,
                        condition_value: conditionValue
                    },
                    data: {
                        [field]: fieldValue
                    }
                }
            });
            const res = mockResponse();

            ValidatorController.respond(req, res, mockNext);

            expect(res.data).toBeCalledWith({
                validation: {
                    error: false,
                    field,
                    field_value: fieldValue,
                    condition,
                    condition_value: conditionValue
                }
            }, `field ${field} successfully validated.`);
        });
    });
});