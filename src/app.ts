import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.redirect('/api/health');
});

app.use('/api/auth', authRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Blog API is running!' });
});

export default app;