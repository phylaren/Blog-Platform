import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Заголовок має містити мінімум 3 символи')
      .max(100, 'Заголовок занадто довгий (максимум 100 символів)'),

    content: z.string()
      .min(10, 'Текст поста має містити мінімум 10 символів'),

    categoryId: z.uuid('Некоректний формат ID категорії')
      .optional()
      .nullable(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Заголовок має містити мінімум 3 символи')
      .max(100, 'Заголовок занадто довгий')
      .optional(),
    
    content: z.string()
      .min(10, 'Текст поста має містити мінімум 10 символів')
      .optional(),
    
    categoryId: z.uuid('Некоректний формат ID категорії')
      .optional()
      .nullable()
  }),
});

export const postIdSchema = z.object({
  params: z.object({
    id: z.uuid('Некоректний формат ID коментаря'),
  }),
});