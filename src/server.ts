import app from './app';
import bcrypt from 'bcryptjs';
import prisma from './config/db';
import logger from './utils/logger';

const PORT = process.env.PORT || 8080;

const seedDatabase = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@blog.com' },
      update: {},
      create: {
        email: 'admin@blog.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const category = await prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: { name: 'Technology' },
    });

    const existingPost = await prisma.post.findFirst();
    
    if (!existingPost) {
      await prisma.post.create({
        data: {
          title: 'Мій перший пост на новій платформі',
          content: 'Це тестовий пост, який підтверджує, що база даних працює чудово!',
          published: true,
          authorId: admin.id,
          categoryId: category.id,
        },
      });
      console.log('Базу успішно наповнено');
    } else {
      console.log('База вже містить початкові дані (пропуск наповнення)');
    }

  } catch (error) {
    logger.error('Помилка при наповненні бази:', error);
  }
};

seedDatabase().then(() => {
  const PORT = process.env.PORT || 8080;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});