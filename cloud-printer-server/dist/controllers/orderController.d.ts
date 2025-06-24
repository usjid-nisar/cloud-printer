import { Request, Response, NextFunction } from 'express';
export declare const createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
