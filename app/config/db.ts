import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URI, MONGODB_TEST_URI } = process.env;

const URI = MONGODB_URI ? MONGODB_URI : 'mongodb://localhost/projectify';

const dbOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const dbConnection = () => {
  mongoose.connect(`${process.env.NODE_ENV === 'test' ? MONGODB_TEST_URI : URI}`, dbOptions);

  const connection = mongoose.connection;

  connection.once('open', () => {
    console.log('Mongodb Connection stablished');
  });

  connection.on('error', (err) => {
    console.log('Mongodb connection error:', err);
    process.exit();
  });
};
