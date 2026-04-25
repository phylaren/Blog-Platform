import { Router } from 'express';
import { addComment, getCommentsByPost, deleteComment } from '../controllers/commentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

import { validate } from '../middlewares/validateMiddleware';
import { addCommentSchema, commentIdSchema } from '../schemas/commentSchema';

router.post('/posts/:postId/comments', protect, validate(addCommentSchema), addComment);
router.get('/posts/:postId/comments', getCommentsByPost);

router.delete('/comments/:id', protect, validate(commentIdSchema), deleteComment);

export default router;