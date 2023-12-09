"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchAsync = void 0;
function CatchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
exports.CatchAsync = CatchAsync;
