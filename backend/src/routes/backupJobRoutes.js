import { Router } from 'express';
import { backupJobController } from '../controllers/backupJobController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', backupJobController.getAll);
router.get('/:id', backupJobController.getById);
router.get('/server/:serverId', backupJobController.getByServer);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), backupJobController.delete);

export default router;
