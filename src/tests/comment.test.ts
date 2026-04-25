import request from 'supertest';
import app from '../app';
import { clearDatabase, disconnectDatabase } from './setup';

describe('Коментарі (Comment API)', () => {
  let authToken: string;
  let testPostId: string;
  let createdCommentId: string;

  beforeAll(async () => {
    await clearDatabase();


    const userRes = await request(app).post('/api/auth/register').send({
      email: 'commenter@blog.com',
      password: 'password123',
      name: 'Коментатор'
    });
    
    authToken = userRes.body.data ? userRes.body.data.token : userRes.body.token;

    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Пост для коментарів',
        content: 'Текст поста'
      });

    testPostId = postRes.body.data ? postRes.body.data.id : postRes.body.id;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/posts/:postId/comments', () => {
    it('Повинен додати коментар до поста', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Це мій перший тестовий коментар!'
        });

      expect(res.status).toBe(201);
      
      const commentData = res.body.data ? res.body.data : res.body;
      expect(commentData.content).toBe('Це мій перший тестовий коментар!');
      
      createdCommentId = commentData.id;
    });

    it('Повинен відхилити порожній коментар (Zod)', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: ''
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts/:postId/comments', () => {
    it('Повинен повернути список коментарів для конкретного поста', async () => {
      const res = await request(app).get(`/api/posts/${testPostId}/comments`);

      expect(res.status).toBe(200);
      
      const commentsArray = res.body.data ? res.body.data : res.body;
      expect(Array.isArray(commentsArray)).toBe(true);
      expect(commentsArray.length).toBeGreaterThan(0);
      expect(commentsArray[0].content).toBe('Це мій перший тестовий коментар!');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('Повинен видалити власний коментар', async () => {
      const res = await request(app)
        .delete(`/api/comments/${createdCommentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });
  });
});