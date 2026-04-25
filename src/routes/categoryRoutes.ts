import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController';
import { protect } from '../middlewares/authMiddleware';

import { validate } from '../middlewares/validateMiddleware';
import { categorySchema, categoryIdSchema } from '../schemas/categorySchema';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, validate(categorySchema), createCategory);
router.delete('/:id', protect, validate(categoryIdSchema), deleteCategory);

export default router;