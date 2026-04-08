import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;