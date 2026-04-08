import { Router } from 'express';
import { addComment, getCommentsByPost, deleteComment } from '../controllers/commentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/posts/:postId/comments', protect, addComment);
router.get('/posts/:postId/comments', getCommentsByPost);

router.delete('/comments/:id', protect, deleteComment);

export default router;