import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.email('Некоректний формат email адреси'),
    password: z.string()
      .min(6, 'Пароль має містити мінімум 6 символів')
      .max(50, 'Пароль занадто довгий'),
    name: z.string()
      .min(2, 'Ім\'я має містити хоча б 2 символи')
      .max(100, 'Ім\'я занадто довге')
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email('Некоректний формат email адреси'),
    password: z.string().min(1, 'Пароль є обов\'язковим полем'),
  }),
});