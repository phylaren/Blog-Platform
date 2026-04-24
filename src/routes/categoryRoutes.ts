import { Router } from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, createCategory);
router.delete('/:id', protect, deleteCategory);

export default router;