import request from 'supertest';
import app from '../app';
import { clearDatabase, disconnectDatabase } from './setup';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';

describe('Категорії (Category API)', () => {
  let authToken: string;
  let createdCategoryId: string;

  beforeAll(async () => {
    await clearDatabase();

    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'admin_test@blog.com',
        password: hashedPassword,
        name: 'Супер Адмін',
        role: 'ADMIN'
      }
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'admin_test@blog.com',
      password: 'password123'
    });
    
    authToken = res.body.token;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/categories', () => {
    it('Повинен успішно створити нову категорію', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Технології' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Технології');
      
      createdCategoryId = res.body.id;
    });

    it('Повинен відхилити створення категорії з надто короткою назвою (Zod)', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'А' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Помилка валідації даних');
    });

    it('Не повинен дозволяти створення без токена', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Спорт' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/categories', () => {
    it('Повинен повернути список усіх категорій', async () => {
      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('Повинен успішно видалити категорію', async () => {
      const res = await request(app)
        .delete(`/api/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });
  });
});