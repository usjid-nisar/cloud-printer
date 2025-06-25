import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            partner?: {
                id: string;
                name: string;
                email: string;
            };
        }
    }
}
export declare const authenticatePartner: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorizePartner: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validatePartnerAccess: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateApiKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
