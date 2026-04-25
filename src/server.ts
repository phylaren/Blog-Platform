import app from './app';
import bcrypt from 'bcryptjs';
import prisma from './config/db';
import logger from './utils/logger';
import { seedDatabase } from './config/seed';

const PORT = process.env.PORT || 8080;

seedDatabase().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});