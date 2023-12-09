import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);

const DOC = {
  username: 'test',
  email: 'abc@gmail.com',
  password: 'test',
  confirmPassword: 'test',
};

describe('GET /api/users/currentuser', () => {
  it("Should return 200 and current user's details ", async () => {
    const authRes = await request.post('/api/v1/users/signup').send(DOC);
    const cookie = authRes.headers['set-cookie'];

    const response = await request
      .get('/api/v1/users/currentuser')
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.currentUser.email).toBe(DOC.email);
  });
});
