import { Router } from 'express';
import { backupScheduleController } from '../controllers/backupScheduleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBackupSchedule, validateRequest } from '../middleware/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', backupScheduleController.getAll);
router.post('/', authorize('SUPER_ADMIN', 'ADMIN'), validateBackupSchedule, validateRequest, backupScheduleController.create);
router.get('/:id', backupScheduleController.getById);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), backupScheduleController.update);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), backupScheduleController.delete);
router.post('/:id/toggle', authorize('SUPER_ADMIN', 'ADMIN'), backupScheduleController.toggle);

export default router;
