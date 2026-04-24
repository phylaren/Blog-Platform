import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.redirect('/api/health');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);


app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Blog API is running!' });
});

export default app;