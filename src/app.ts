import express from 'express';
import cors from 'cors';
import adminRouter from "./routes/admin.router.js";
import { MErrorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/auth', adminRouter);
// app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", adminRouter);

app.use(MErrorHandler);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});