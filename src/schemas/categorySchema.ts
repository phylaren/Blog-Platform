import { z } from 'zod';

export const categorySchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Назва має містити хоча б 2 символи')
      .max(30, 'Назва занадто довга')
      .refine(value => value !== '', {
        message: 'Назва категорії обов\'язкова',
        path: ['body', 'name'],
      }),
  }),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.uuid('Некоректний формат ID категорії'),
  }),
});