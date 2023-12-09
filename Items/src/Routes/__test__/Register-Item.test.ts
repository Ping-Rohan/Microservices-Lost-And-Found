import supertest from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/setup';

const request = supertest(app);

const ITEM = {
  _id: new mongoose.Types.ObjectId(),
  itemCategory: 'Electronics',
  itemName: 'Laptop',
  itemDescription: 'Acer Aspire ',
  itemOwner: new mongoose.Types.ObjectId(),
  itemImages: ['abc'],
  itemStatus: 'lost',
  lostLocation: {
    type: 'Point',
    coordinates: [31.2357, 30.0444],
  },
  lostDate: new Date(),
};

describe('POST /api/v1/items/register', () => {
  it('Should return 201 on successful registration', async () => {
    const response = await request
      .post('/api/v1/items/register')
      .set('Cookie', `jwt=${signin()}`)
      .send(ITEM);

    expect(response.status).toBe(201);
  });

  it('Should return 500 if any of the required fields are missing', async () => {
    await request
      .post('/api/v1/items/register')
      .send({})
      .set(`Cookie`, `jwt=${signin()}`)
      .expect(500);
  });

  it('Should return 401 if user is not logged in ', async () => {
    await request.post('/api/v1/items/register').send(ITEM).expect(401);
  });
});
