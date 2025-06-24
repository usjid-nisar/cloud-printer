import { Request, Response, NextFunction } from 'express';
export declare const validateShopifyWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateWooCommerceWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
