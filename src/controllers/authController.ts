import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/authMiddleware';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Користувач з таким email вже існує' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      message: 'Реєстрація успішна',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка сервера під час реєстрації' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Неправильний email або пароль' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Неправильний email або пароль' });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      message: 'Успішний вхід',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка сервера під час входу' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'ID користувача не знайдено' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    if (!user) {
      res.status(404).json({ error: 'Користувача не знайдено' });
      return;
    }

    res.json(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({ where: { id: userId! } });
    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Доступ заборонено. Тільки для адміністраторів' });
      return;
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Помилка при отриманні користувачів' });
  }
};