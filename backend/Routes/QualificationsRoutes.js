import { Router } from 'express';
import { create, getAll, getOne, update, remove } from '../controllers/QualificationController.js';
import { authenticated } from '../middleware/Authentication.js';

const router = Router();
router.use(authenticated);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;