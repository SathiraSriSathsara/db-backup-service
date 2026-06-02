import { Router } from 'express';
import { storageProviderController } from '../controllers/storageProviderController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateStorageProvider, validateRequest } from '../middleware/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', storageProviderController.getAll);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), validateStorageProvider, validateRequest, storageProviderController.create);
router.get('/:id', storageProviderController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), storageProviderController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), storageProviderController.delete);

export default router;
