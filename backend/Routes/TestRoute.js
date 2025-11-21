import { Router } from 'express';
import { testCreate } from '../controllers/TestController.js';
import { authenticated } from '../middleware/Authentication.js';

const router = Router();

router.use(authenticated);
router.post('/', testCreate);

export default router;