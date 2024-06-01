import { Router, Request, Response } from 'express';
import { ContactsController } from '../../controllers/contacts_controller';

const router = Router();

const controller = new ContactsController()

router.get('/', controller.index);
router.get('/searchByPhoneNumber/:phoneNumber', controller.searchByPhoneNumber);
router.post('/', controller.create);

export default router;