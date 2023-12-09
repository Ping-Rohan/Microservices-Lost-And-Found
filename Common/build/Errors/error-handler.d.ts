import { NextFunction, Request, Response } from 'express';
interface ErrorType extends Error {
    statusCode: number;
    isOperational: boolean;
    message: string;
    status: string;
    stack?: string;
    errors?: any;
    path?: string;
    value?: string;
    code?: number;
    errmsg?: string;
}
export declare const errorHandler: (err: ErrorType, req: Request, res: Response, next: NextFunction) => void;
export {};
