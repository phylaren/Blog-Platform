import request from 'supertest';
import app from '../app';
import { clearDatabase, disconnectDatabase } from './setup';

describe('Авторизація (Auth API)', () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Іван Тестер'
  };

  describe('POST /api/auth/register', () => {
    it('Повинен успішно зареєструвати нового користувача', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('Повинен відхилити реєстрацію з існуючим email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Користувач з таким email вже існує');
    });
  });

  describe('POST /api/auth/login', () => {
    it('Повинен успішно залогінити користувача і видати токен', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('Повинен відхилити логін з неправильним паролем', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('Повинен повернути дані користувача з валідним токеном', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      
      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
    });

    it('Повинен відмовити в доступі без токена (спрацює protect middleware)', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });
});