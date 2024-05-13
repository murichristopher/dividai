import { Router, Request, Response } from 'express';
import { DebtsController } from '../../controllers/debts_controller';

const router = Router();

const controller = new DebtsController()

router.get('/', controller.index);
router.post('/', controller.create);

export default router;