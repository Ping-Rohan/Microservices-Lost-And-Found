import { NextFunction, Request, Response } from 'express';
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
declare function CatchAsync(fn: AsyncFunction): (req: Request, res: Response, next: NextFunction) => void;
export { CatchAsync };
