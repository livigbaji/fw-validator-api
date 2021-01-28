const {
    mockRequest,
    mockResponse,
} = require('../__mocks__/http');
const notFoundMiddleware = require('./not-found.middleware');

describe('Not found middleware', () => {
    test('shows not found message', () => {
        const method = 'GET';
        const originalUrl = '/suits';
        const req = mockRequest({
            method,
            originalUrl
        });
        const res = mockResponse();

        notFoundMiddleware(req, res);
        expect(res.status).toBeCalledWith(404);
        expect(res.errorMessage).toBeCalledWith(`cannot ${method} ${originalUrl}`);
    });
});