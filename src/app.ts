import express from 'express';
import cors from 'cors';
import { MErrorHandler } from './middlewares/error.middleware.js';
import { connectRedis } from './configs/redis.config.js';
import authRouter from './routes/auth.router.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('api/v1/auth', authRouter);

app.use(MErrorHandler);

connectRedis();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});