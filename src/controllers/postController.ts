import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, categoryId } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      res.status(401).json({ error: 'Неавторизовано' });
      return;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        categoryId,
        published: true,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при створенні поста' });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при отриманні постів' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id },   
      include: {
        author: { select: { name: true } },
        category: true,
        comments: { include: { author: { select: { name: true } } } },
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Пост не знайдено' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при отриманні поста' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, content, categoryId } = req.body;
    const userId = req.user?.id;

    const post = await prisma.post.findUnique({ where: { id } });   

    if (!post) {
      res.status(404).json({ error: 'Пост не знайдено' });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Ви можете редагувати лише свої власні пости' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, categoryId },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при оновленні поста' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const post = await prisma.post.findUnique({ where: { id } });   

    if (!post) {
      res.status(404).json({ error: 'Пост не знайдено' });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Ви можете видаляти лише свої власні пости' });
      return;
    }

    await prisma.post.delete({ where: { id } });   

    res.json({ message: 'Пост успішно видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при видаленні поста' });
  }
};