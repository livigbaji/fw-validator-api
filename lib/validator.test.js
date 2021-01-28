const Validator = require('./validator');

describe('Validator Library', () => {
    describe('gte for (a,b)', () => {
        test('returns true if a is greater than b', () => {
            expect(Validator.gte(3, 2)).toBe(true);
        });
    
        test('returns true if a is equal to b', () => {
            expect(Validator.gte(2, 2)).toBe(true);
        });
    
        test('returns false if a is less than b', () => {
            expect(Validator.gte(1, 2)).toBe(false);
        });
    });

    describe('gt for (a,b)', () => {
        test('returns true if a is greater than b', () => {
            expect(Validator.gt(3, 2)).toBe(true);
        });

        test('returns false if a is equal to b', () => {
            expect(Validator.gt(2, 2)).toBe(false);
        });

        test('returns false if a is less than b', () => {
            expect(Validator.gt(1, 2)).toBe(false);
        });
    });

    describe('eq for (a,b)', () => {
        test('returns true if a equal to b (string)', () => {
            expect(Validator.eq('stuff', 'stuff')).toBe(true);
        });

        test('returns true if a equal to b (number)', () => {
            expect(Validator.eq(4, 4)).toBe(true);
        });

        test('returns false if a greater than b', () => {
            expect(Validator.eq(3, 2)).toBe(false);
        });

        test('returns false if a is less than b', () => {
            expect(Validator.eq(1, 2)).toBe(false);
        });
    });

    describe('neq for (a,b)', () => {

        test('returns true if a is not equal to b (string)', () => {
            expect(Validator.neq('stuff', 'nostuff')).toBe(true);
        });

        test('returns false if a equal to b', () => {
            expect(Validator.neq('stuff', 'stuff')).toBe(false);
        });

        test('returns true if a greater than b', () => {
            expect(Validator.neq(3, 2)).toBe(true);
        });

        test('returns true if a is less than b', () => {
            expect(Validator.neq(1, 2)).toBe(true);
        });
    });

    describe('contains for (a,b)', () => {
        test('returns false if a does not have includes method (number)', () => {
            expect(Validator.contains(1, 2)).toBe(false);
        });

        test('returns false if a does not contain b', () => {
            expect(Validator.contains([1,3], 2)).toBe(false);
        });

        test('returns true if a does not contain b', () => {
            expect(Validator.contains([1, 2], 2)).toBe(true);
        });
    });

    describe('validate method', () => {
        test('throws error condition must be a defined method', () => {
            const condition = 'hii';
            expect(() => Validator.validate({ condition, field: 'hey', conditionValue: 'hey' }))
            .toThrowError(`Condition '${condition}' is not allowed`);
        });

        test('invokes condition if it is a defined method', () => {
            const condition = 'gt';
            const conditionSpy = jest.spyOn(Validator, condition);

            Validator.validate({
                condition,
                field: 2,
                conditionValue: 3
            });

            expect(conditionSpy).toBeCalledWith(2, 3);
        });
    });

    describe('extractFieldValue method', () => {
        test('Array data returns array value', () => {
            const result = Validator.extractFieldValue([1, 2, 3], '0');
            expect(result).toEqual([1, 2, 3]);
        });

        test('String data returns string value', () => {
            const result = Validator.extractFieldValue('john', '0');
            expect(result).toBe('john');
        });

        test('Object data returns key value mathing field specified', () => {
            const result = Validator.extractFieldValue({
                hello: 'hey'
            }, 'hello');
            expect(result).toBe('hey');
        });
    });
});