"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingRoutes = void 0;
const express_1 = require("express");
const onboardingController_1 = require("../controllers/onboardingController");
const validateRequest_1 = require("../middleware/validateRequest");
const auth_1 = require("../middleware/auth");
const onboardingValidators_1 = require("../validators/onboardingValidators");
const router = (0, express_1.Router)();
exports.onboardingRoutes = router;
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
router.post('/create', (0, validateRequest_1.validateRequest)(onboardingValidators_1.createPartnerSchema), onboardingController_1.onboardingController.createPartner);
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
router.post('/validate-domain/:domain', auth_1.authenticatePartner, (0, validateRequest_1.validateRequest)(onboardingValidators_1.validateDomainSchema), onboardingController_1.onboardingController.validateDomain);
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
router.put('/:partnerId/branding', auth_1.authenticatePartner, (0, validateRequest_1.validateRequest)(onboardingValidators_1.updateBrandingSchema), onboardingController_1.onboardingController.updateBranding);
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
router.post('/:partnerId/rotate-key', auth_1.authenticatePartner, onboardingController_1.onboardingController.rotateApiKey);
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
router.post('/validate-key', onboardingController_1.onboardingController.validateApiKey);
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
router.get('/:partnerId/status', auth_1.authenticatePartner, onboardingController_1.onboardingController.getOnboardingStatus);
