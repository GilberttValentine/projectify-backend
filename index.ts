import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { dbConnection } from './app/config/db';

export const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

export const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  dbConnection();
});
