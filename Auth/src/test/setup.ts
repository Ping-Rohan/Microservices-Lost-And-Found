import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';

const request = supertest(app);

let mongoMemory: any;

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
