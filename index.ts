import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { dbConnection } from './app/config/db';
import { router } from './app/config/routes';
import { ErrorHandler } from './app/utils/errorHandlerMiddleware';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', router);
app.use(ErrorHandler);

export const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  dbConnection();
});
