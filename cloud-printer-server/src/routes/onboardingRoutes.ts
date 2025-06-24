import { Router } from 'express';
import { onboardingController } from '../controllers/onboardingController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticatePartner } from '../middleware/auth';
import {
  createPartnerSchema,
  updateBrandingSchema,
  validateDomainSchema,
} from '../validators/onboardingValidators';

const router = Router();

/**
 * @swagger
 * /v1/onboarding/create:
 *   post:
 *     summary: Create a new partner account
 *     tags: [Onboarding]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               domain:
 *                 type: string
 *               brandingData:
 *                 type: object
 *     responses:
 *       201:
 *         description: Partner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 partnerId:
 *                   type: string
 *                 apiKey:
 *                   type: string
 *                   description: API key (shown only once)
 */
router.post(
  '/create',
  validateRequest(createPartnerSchema),
  onboardingController.createPartner
);

/**
 * @swagger
 * /v1/onboarding/validate-domain/{domain}:
 *   post:
 *     summary: Validate domain DNS setup
 *     tags: [Onboarding]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Domain validation status
 */
router.post(
  '/validate-domain/:domain',
  authenticatePartner,
  validateRequest(validateDomainSchema),
  onboardingController.validateDomain
);

/**
 * @swagger
 * /v1/onboarding/{partnerId}/branding:
 *   put:
 *     summary: Update partner branding settings
 *     tags: [Onboarding]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandingData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Branding updated successfully
 */
router.put(
  '/:partnerId/branding',
  authenticatePartner,
  validateRequest(updateBrandingSchema),
  onboardingController.updateBranding
);

/**
 * @swagger
 * /v1/onboarding/{partnerId}/rotate-key:
 *   post:
 *     summary: Rotate partner API key
 *     tags: [Onboarding]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key rotated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: New API key (shown only once)
 */
router.post(
  '/:partnerId/rotate-key',
  authenticatePartner,
  onboardingController.rotateApiKey
);

/**
 * @swagger
 * /v1/onboarding/validate-key:
 *   post:
 *     summary: Validate API key
 *     tags: [Onboarding]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: API key validation result
 */
router.post(
  '/validate-key',
  onboardingController.validateApiKey
);

/**
 * @swagger
 * /v1/onboarding/{partnerId}/status:
 *   get:
 *     summary: Get partner onboarding status
 *     tags: [Onboarding]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current onboarding status
 */
router.get(
  '/:partnerId/status',
  authenticatePartner,
  onboardingController.getOnboardingStatus
);

export { router as onboardingRoutes }; 