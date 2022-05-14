import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

const URI = MONGODB_URI ? MONGODB_URI : 'mongodb://localhost/projectify';

const dbOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

export const dbConnection = () => {
  mongoose.connect(URI, dbOptions);
  
  const connection = mongoose.connection;

  connection.once('open', () => {
    console.log('Mongodb Connection stablished');
  });

  connection.on('error', (err) => {
    console.log('Mongodb connection error:', err);
    process.exit();
  });
};
