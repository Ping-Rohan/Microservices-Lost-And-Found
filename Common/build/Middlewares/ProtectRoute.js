"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const App_Error_1 = require("../Errors/App-Error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function protectRoute(req, res, next) {
    if (!req.cookies.jwt)
        return next(new App_Error_1.AppError('Please login to continue', 401));
    const token = req.cookies.jwt;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
}
exports.protectRoute = protectRoute;
