import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);

describe('POST /api/users/logout', () => {
  it('Should return 200 on successful logout', async () => {
    const response = await request.post('/api/v1/users/logout').send({});
    expect(response.statusCode).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined(); // set cookie is used for clearing the cookie too
  });
});
