import bcrypt from "bcryptjs";
import prisma from "../config/db";
import logger from "../utils/logger";

export async function seedDatabase() {
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

    const user = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        name: 'Олексій Тестер',
        password: hashedPassword,
        role: 'USER',
      },
    });

    const categoriesData = ['Technology', 'Lifestyle', 'Education', 'Health'];
    const categories = await Promise.all(
      categoriesData.map(name =>
        prisma.category.upsert({
          where: { name },
          update: {},
          create: { name }
        })
      )
    );

    const postCount = await prisma.post.count();

    if (postCount < 5) {
      const postsToCreate = [];
      for (let i = 1; i <= 15; i++) {
        const category = categories[i % categories.length];

        if (!category) continue;

        postsToCreate.push({
          title: `Пост №${i}: Глибоке занурення у ${category.name}`,
          content: `Це дуже цікавий контент...`,
          published: i % 3 !== 0,
          authorId: i % 2 === 0 ? admin.id : user.id,
          categoryId: category.id,
        });
      }

      await prisma.post.createMany({ data: postsToCreate });

      const firstPost = await prisma.post.findFirst();
      if (firstPost) {
        await prisma.comment.createMany({
          data: [
            { content: 'Вау, дуже крута стаття!', postId: firstPost.id, authorId: user.id },
            { content: 'Дякую за інформацію, чекаю на продовження', postId: firstPost.id, authorId: admin.id },
          ]
        });
      }

      console.log('Базу успішно наповнено розширеними даними');
    } else {
      console.log('ℹБаза вже містить достатньо даних');
    }

  } catch (error) {
    logger.error('Помилка при наповненні бази:', error);
  }
}