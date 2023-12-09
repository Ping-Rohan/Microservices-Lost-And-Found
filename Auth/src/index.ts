import { app } from './app';
import mongoose from 'mongoose';
import { broker } from './utils/rabbitmq';

const CONNECT_DB = async () => {
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
};

app.listen(3000, async () => {
  console.log('Auth service started at port 3000');
  await broker.connect();
  await broker.CreateExchange('items');
  await broker.ConsumeMessage({
    EXCHANGE_NAME: 'items',
    ROUTING_KEY: 'items',
  });
});

CONNECT_DB()
  .then(() => {
    console.log('Connected to AUTH MongoDB');
  })
  .catch((err) => console.log(err));
