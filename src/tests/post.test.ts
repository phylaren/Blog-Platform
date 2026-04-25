import request from 'supertest';
import app from '../app';
import { clearDatabase, disconnectDatabase } from './setup';

describe('Пости (Post API)', () => {
  let authToken: string;
  let createdPostId: string;

  beforeAll(async () => {
    await clearDatabase();

    const res = await request(app).post('/api/auth/register').send({
      email: 'writer@blog.com',
      password: 'password123',
      name: 'Письменник'
    });
    authToken = res.body.token;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/posts', () => {
    it('Повинен створити новий пост', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Тестовий заголовок',
          content: 'Дуже цікавий текстовий контент для нашого поста',
          published: true
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Тестовий заголовок');
      
      createdPostId = res.body.id; 
    });

    it('Не повинен дозволяти створення поста без авторизації', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({
          title: 'Хакерський пост',
          content: 'Контент'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/posts', () => {
    it('Повинен повернути список постів (з пагінацією)', async () => {
      const res = await request(app).get('/api/posts');

      expect(res.status).toBe(200);
      
      expect(res.body).toHaveProperty('data'); 
      
      expect(Array.isArray(res.body.data)).toBe(true);
      
      expect(res.body.data.length).toBeGreaterThan(0); 
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('Повинен оновити власний пост', async () => {
      const res = await request(app)
        .put(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Оновлений заголовок' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Оновлений заголовок');
    });
  });
});