
const {
    mockRequest,
    mockResponse,
    mockNext
} = require('../__mocks__/http');
const catchAllMiddleware = require('./catch-all-errors.middleware');

describe('Catch all errors middleware', () => {
    test('does not log errors in non development environment', async () => {
        process.env.NODE_ENV = 'spaceship';
        const req = mockRequest();
        const res = mockResponse();

        const consoleSpy = jest.spyOn(console, 'error');
        consoleSpy.mockImplementation((...args) => true);
        const error = {
            stuff: 'you got this wrong'
        };

        await catchAllMiddleware(error, req, res, mockNext);
        expect(consoleSpy).not.toBeCalled();
    });

    test('logs errors in development environment', async () => {
        process.env.NODE_ENV = 'development';
        const req = mockRequest();
        const res = mockResponse();

        const consoleSpy = jest.spyOn(console, 'error');
        consoleSpy.mockImplementation((...args) => true);
        const error = {
            stuff: 'you got this wrong'
        };

        await catchAllMiddleware(error, req, res, mockNext);
        expect(consoleSpy).toBeCalledWith(error);
    });

    test('responds with HTTPErrorResponse if error cannot be serialized to string', async () => {
        process.env.NODE_ENV = 'spaceship';
        const req = mockRequest();
        const res = mockResponse();

        const error = {
            stuff: 'you got this wrong'
        };

        await catchAllMiddleware(error, req, res, mockNext);
        expect(res.error).toBeCalledWith(error);
    });

    test('responds with HTTPErrorMessage if error can be serialized to string', async () => {
        process.env.NODE_ENV = 'spaceship';
        const req = mockRequest();
        const res = mockResponse();

        const error = 'you got this wrong';

        await catchAllMiddleware(error, req, res, mockNext);
        expect(res.errorMessage).toBeCalledWith(error);
    });

    test('json parse errors are reported differently', async () => {
        process.env.NODE_ENV = 'spaceship';
        const req = mockRequest();
        const res = mockResponse();

        const error = {
            type: 'entity.parse.failed'
        };

        await catchAllMiddleware(error, req, res, mockNext);
        expect(res.status).toBeCalledWith(400);
        expect(res.errorMessage).toBeCalledWith('Invalid JSON payload passed.');
    });
});