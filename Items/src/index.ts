import { app } from './app';
import mongoose from 'mongoose';
import { broker } from './Utils';

const CONNECT_DB = async () => {
  await mongoose.connect('mongodb://items-mongo-srv:27017/items');
};

app.listen(3001, async () => {
  console.log('Server listening on port 3001');
  await broker.connect();
  await broker.CreateExchange('items');

  broker.ConsumeMessage({
    EXCHANGE_NAME: 'items',
    ROUTING_KEY: 'currentUser',
  });
});

CONNECT_DB()
  .then(() => {
    console.log('Connected to ITEM MongoDB');
  })
  .catch((err) => console.log(err));
