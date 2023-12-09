"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const App_Error_1 = require("./App-Error");
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    // handling mongoose errors
    if (err.name == 'validationError')
        err = handleValidationError(err);
    if (err.name == 'CastError')
        err = handleCastError(err);
    if (err.code === 11000)
        err = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError')
        err = new App_Error_1.AppError('Invalid token. Please log in again', 401);
    console.log('ERROR 🚨', err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
exports.errorHandler = errorHandler;
const handleValidationError = (err) => {
    let errors = Object.values(err.errors).map((el) => el.message);
    const errorMessage = errors.join(', ');
    return new App_Error_1.AppError(errorMessage, 400);
};
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new App_Error_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    var _a;
    const value = (_a = err.errmsg) === null || _a === void 0 ? void 0 : _a.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new App_Error_1.AppError(message, 400);
};
