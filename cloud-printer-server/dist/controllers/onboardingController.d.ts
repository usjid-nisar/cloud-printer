import { Request, Response, NextFunction } from 'express';
export declare const onboardingController: {
    createPartner(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateDomain(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateBranding(req: Request, res: Response, next: NextFunction): Promise<void>;
    rotateApiKey(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateApiKey(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOnboardingStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
};
