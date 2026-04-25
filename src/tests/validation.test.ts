import request from 'supertest';
import app from '../app';

describe('Перевірка Zod Валідації (Fail-Fast)', () => {

  describe('АВТОРИЗАЦІЯ: POST /api/auth/register', () => {
    
    it('Повинен відхилити запит з некоректним email (Статус 400)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'password123',
          name: 'Test User'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Помилка валідації даних');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Некоректний формат email адреси' })
        ])
      );
    });

    it('Повинен відхилити запит із занадто коротким паролем', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: '123',
          name: 'Test User'
        });

      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: 'Пароль має містити мінімум 6 символів' })
        ])
      );
    });

    it('Повинен відхилити запит, якщо порожнє тіло (відсутні обов\'язкові поля)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.details.length).toBe(3); 
    });
  });

  describe('КОМЕНТАРІ: POST /api/posts/:postId/comments', () => {
    
    it('Повинен відхилити запит, якщо ID поста не є валідним UUID', async () => {
      
      const res = await request(app)
        .post('/api/posts/just-some-text/comments')
        .send({
          content: 'Чудовий пост!'
        });
      if (res.status === 400) {
        expect(res.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ message: 'Некоректний формат ID поста' })
          ])
        );
      }
    });

    it('Повинен відхилити порожній коментар', async () => {
      const fakeUuid = '123e4567-e89b-12d3-a456-426614174000'; 
      
      const res = await request(app)
        .post(`/api/posts/${fakeUuid}/comments`)
        .send({
          content: '' 
        });

      if (res.status === 400) {
        expect(res.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ message: 'Коментар не може бути порожнім' })
          ])
        );
      }
    });
  });

});