import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';
import logger from '../utils/logger';

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId as string;
    const { content } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      res.status(401).json({ error: 'Неавторизовано' });
      return;
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ error: 'Пост не знайдено' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: { select: { name: true } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка при додаванні коментаря' });
  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.postId as string;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка при отриманні коментарів' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      res.status(404).json({ error: 'Коментар не знайдено' });
      return;
    }

    if (comment.authorId !== userId) {
      res.status(403).json({ error: 'Ви можете видаляти лише свої коментарі' });
      return;
    }

    await prisma.comment.delete({ where: { id } });

    res.json({ message: 'Коментар успішно видалено' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка при видаленні коментаря' });
  }
};