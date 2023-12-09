declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly status: string;
    constructor(message: string, statusCode: number);
}
export { AppError };
