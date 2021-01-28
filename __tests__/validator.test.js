const request = require('supertest');
const app = require('../app');

describe('POST /validate-rule', () => {
    test('valid payload returns validation success reponse', async () => {
        const response = await request(app).post('/validate-rule').send({
                rule: {
                    field: 'missions',
                    condition: 'gte',
                    condition_value: 30
                },
                data: {
                    name: 'James Holden',
                    crew: 'Rocinante',
                    age: 34,
                    position: 'Captain',
                    missions: 45
                }
        }).expect(200);

        expect(response.body).toMatchObject({
                message: 'field missions successfully validated.',
                status: 'success',
                data: {
                    validation: {
                        error: false,
                        field: 'missions',
                        field_value: 45,
                        condition: 'gte',
                        condition_value: 30
                    }
                }
        });
    });

    test('invalid payload returns validation error reponse', async () => {
        const fieldValue = 'damien-marley';

        const response = await request(app).post('/validate-rule').send({
           rule: {
               field: '0',
               condition: 'eq',
               condition_value: 'a'
           },
           data: fieldValue
        }).expect(400);

        expect(response.body).toMatchObject({
            message: 'field 0 failed validation.',
            status: 'error',
            data: {
                validation: {
                    error: true,
                    field: '0',
                    field_value: fieldValue,
                    condition: 'eq',
                    condition_value: 'a'
                }
            }
        });
    });


    test('missing fields in payload returns error reponse', async () => {
        const response = await request(app).post('/validate-rule').send({
            rule: {
                field: '5',
                condition: 'contains',
                condition_value: 'rocinante'
            },
            data: ['The Nauvoo', 'The Razorback', 'The Roci', 'Tycho']
        }).expect(400);

        expect(response.body).toMatchObject({
            message: 'field 5 is missing from data.',
            status: 'error',
            data: null
        });
    });
});