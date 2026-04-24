import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при отриманні категорій' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Неавторизовано' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Доступ заборонено. Тільки для адміністраторів' });
      return;
    }

    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при створенні категорії' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Неавторизовано' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });  
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Доступ заборонено' });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Категорію успішно видалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при видаленні категорії' });
  }
};