import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: Decoded;
        }
    }
}
interface Decoded {
    id: string;
    email: string;
    exp: number;
    iat: number;
}
declare function protectRoute(req: Request, res: Response, next: NextFunction): void;
export { protectRoute };
