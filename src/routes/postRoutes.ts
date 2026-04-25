import { Router } from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController';
import { protect } from '../middlewares/authMiddleware';

import { validate } from '../middlewares/validateMiddleware';
import { createPostSchema, updatePostSchema, postIdSchema } from '../schemas/postSchema';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', protect, validate(createPostSchema), createPost);
router.put('/:id', protect, validate(updatePostSchema), updatePost);
router.delete('/:id', protect, validate(postIdSchema), deletePost);

export default router;