import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.post('/change-password', userController.changePassword);
router.delete('/:id', authorize('SUPER_ADMIN'), userController.delete);

export default router;
