import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
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

  await prisma.post.create({
    data: {
      title: 'Мій перший пост на новій платформі',
      content: 'Це тестовий пост, який підтверджує, що база даних працює чудово!',
      published: true,
      authorId: admin.id,
      categoryId: category.id,
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });