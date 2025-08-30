import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js'; // authRouter'ı import et
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser'; // cookieParser'ı import et

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser()); // cookieParser'ı kullan

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter); // authRouter'ı kullan

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};