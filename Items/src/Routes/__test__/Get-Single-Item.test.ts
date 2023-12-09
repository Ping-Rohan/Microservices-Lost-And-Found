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

describe('GET /api/items/:id', () => {
  it('Should return 200 OK on success', async () => {
    await request
      .post('/api/v1/items/register')
      .set('Cookie', `jwt=${signin()}`)
      .send(ITEM)
      .expect(201);

    const response = await request
      .get(`/api/v1/items/${ITEM._id}`)
      .set('Cookie', `jwt=${signin()}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.itemName).toEqual(ITEM.itemName);
  });
});
