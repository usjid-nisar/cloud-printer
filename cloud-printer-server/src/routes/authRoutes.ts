import { Router } from 'express';
import { AuthService } from '../services/authService';
import { authenticate, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { authValidators } from '../validators/authValidators';

const router = Router();
const authService = new AuthService();

// Public routes
router.post(
  '/login',
  validateRequest(authValidators.login),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/register',
  validateRequest(authValidators.register),
  async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await authService.logout(token);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.get('/me', authenticate, (req, res) => {
  const { password, ...user } = req.user;
  res.json(user);
});

// Admin routes
router.post(
  '/admin',
  authenticate,
  requireRole(['admin']),
  validateRequest(authValidators.register),
  async (req, res, next) => {
    try {
      const result = await authService.createAdminUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/users/:userId/deactivate',
  authenticate,
  requireRole(['admin']),
  async (req, res, next) => {
    try {
      const result = await authService.deactivateUser(req.params.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/users/:userId/reactivate',
  authenticate,
  requireRole(['admin']),
  async (req, res, next) => {
    try {
      const result = await authService.reactivateUser(req.params.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 