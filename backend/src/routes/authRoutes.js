import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateLogin, validateRegister, validateRequest } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validateRegister, validateRequest, authController.register);
router.post('/login', authLimiter, validateLogin, validateRequest, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

export default router;
