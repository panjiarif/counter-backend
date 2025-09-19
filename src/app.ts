import express from 'express';
import cors from 'cors';
import { MErrorHandler } from './middlewares/error.middleware.js';
import { connectRedis } from './configs/redis.config.js';

// import routes
import authRouter from './routes/auth.router.js';
import queueRouter from './routes/queue.router.js';
import counterRouter from './routes/counter.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/queue', queueRouter);
app.use('/api/v1/counter', counterRouter);

app.use(MErrorHandler);

connectRedis();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});