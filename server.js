import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {
  notFound,
  errorHandler,
} from './backend/middleware/errorMiddleware.js';
import connectDB from './backend/config/db.js';
import userRoutes from './backend/routes/userRoutes.js';

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
