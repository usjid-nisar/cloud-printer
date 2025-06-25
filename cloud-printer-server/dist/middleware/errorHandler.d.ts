import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const uncaughtExceptionHandler: (error: Error) => void;
export declare const unhandledRejectionHandler: (reason: any, promise: Promise<any>) => void;
