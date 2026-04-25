import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, 'Заголовок має містити мінімум 3 символи')
      .max(100, 'Заголовок занадто довгий (максимум 100 символів)')
      .refine(value => value !== null && value !== undefined, {
        message: 'Заголовок є обов\'язковим',
        path: ['body', 'title'],
      }),

    content: z.string()
      .min(10, 'Текст поста має містити мінімум 10 символів')
      .refine(value => value !== null && value !== undefined, {
        message: 'Контент є обов\'язковим',
        path: ['body', 'content'],
      }),

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
      .nullable(),
  }),
});