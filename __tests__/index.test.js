
const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
    test('returns my complete profile info', async () => {
        const response = await request(app).get('/').expect(200);
        expect(response.body).toMatchObject({
            status: 'success',
            message: 'My Rule-Validation API'
        });
        expect(response.body).toHaveProperty('data');
        const data = response.body.data;
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('github');
        expect(data.github.startsWith('@')).toBe(true);
        expect(data).toHaveProperty('email');
        expect(data).toHaveProperty('mobile');
        expect(data).toHaveProperty('twitter');
        expect(data.twitter.startsWith('@')).toBe(true);
    });
});