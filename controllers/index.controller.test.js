const { mockNext, mockRequest, mockResponse } = require('../__mocks__/http');
const IndexController = require('./index.controller');

describe('Index Controller', () => {
    test('Get Method returns my valid info', () => {
        const req = mockRequest();
        const res = mockResponse();

        IndexController.get(req, res, mockNext);

        expect(res.data).toBeCalledWith({
            name: 'Livinus Igbaji Oga-ifu',
            github: '@bestbrain10',
            email: 'livinus619@live.com',
            mobile: '07038761251',
            twitter: '@bigmaven'
        }, 'My Rule-Validation API');
    });
});