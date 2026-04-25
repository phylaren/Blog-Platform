import { z } from 'zod';

export const addCommentSchema = z.object({
  params: z.object({
    postId: z.uuid('Некоректний формат ID поста'),
  }),
  body: z.object({
    content: z.string()
      .min(1, 'Коментар не може бути порожнім')
      .max(500, 'Коментар занадто довгий (макс. 500 символів)')
      .refine(value => value !== null && value !== undefined, {
        message: 'Текст коментаря обов\'язковий',
        path: ['body', 'content'],
      }),
  }),
});

export const commentIdSchema = z.object({
  params: z.object({
    id: z.uuid('Некоректний формат ID коментаря'),
  }),
});