import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let mongoMemory: any;

const signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'rohan@gmail.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  return token;
};

beforeAll(async () => {
  process.env.JWT_KEY = 'test';
  mongoMemory = await MongoMemoryServer.create();
  const uri = mongoMemory.getUri();
  await mongoose.connect(uri);
  console.log('Connected to MongoMemoryServer');
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoMemory.stop();
  await mongoose.connection.close();
});

export { signin };
