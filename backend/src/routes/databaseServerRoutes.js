import { Router } from 'express';
import { databaseServerController } from '../controllers/databaseServerController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateDatabaseServer, validateRequest } from '../middleware/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', databaseServerController.getAll);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), validateDatabaseServer, validateRequest, databaseServerController.create);
router.get('/:id', databaseServerController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), databaseServerController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), databaseServerController.delete);
router.post('/:id/test-connection', databaseServerController.testConnection);

export default router;
