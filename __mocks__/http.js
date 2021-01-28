exports.mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.data = jest.fn().mockReturnValue(res);
    res.error = jest.fn().mockReturnValue(res);
    res.errorMessage = jest.fn().mockReturnValue(res);
    return res;
};


exports.mockRequest = ({
    body = {},
    params = {},
    user = {},
    query = {},
    method,
    originalUrl
} = {}) => {
    return {
        body,
        params,
        user,
        method,
        originalUrl,
        query,
        get: (arg) => arg
    };
};


exports.mockNext = () => {};

