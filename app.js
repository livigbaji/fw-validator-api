const express = require('express');

const app = express();

const catchAllErrorsMiddleware = require('./middlewares/catch-all-errors.middleware');
const notFoundMiddleware = require('./middlewares/not-found.middleware');
const indexRoute = require('./routes/index.route');
const validatorRoute = require('./routes/validator.route');

const customExpress = Object.create(express().response, {
    data: {
        value: function (data, message = 'API response message') {
            return this.type('json').status(200).json({
                message,
                status: 'success',
                data: data
            });
        }
    },
    error: {
        value: function (error, message = 'API response message') {
            return this.json({
                message,
                status: 'error',
                data: error,
            });
        }
    },
    errorMessage: {
        value: function (message = 'API response message') {
            return this.json({
                message,
                status: 'error',
                data: null,
            });
        }
    }
});

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


app.response = Object.create(customExpress);
app.use('/', indexRoute);
app.use('/validate-rule', validatorRoute);


// catch all errors middleware
app.use(catchAllErrorsMiddleware);


// 404 catch route
app.use('*', notFoundMiddleware);

module.exports = app;