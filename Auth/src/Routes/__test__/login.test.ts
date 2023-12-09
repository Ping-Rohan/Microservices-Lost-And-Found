import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);

const DOC = {
  username: 'test',
  email: 'abc@gmail.com',
  password: 'test',
  confirmPassword: 'test',
};

describe('POST /api/users/login', () => {
  it('Should return 200 on successful login with JWT', async () => {
    await request.post('/api/v1/users/signup').send(DOC);
    const response = await request.post('/api/v1/users/login').send({
      email: DOC.email,
      password: DOC.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('Should return 401 if  password is incorrect', async () => {
    await request.post('/api/v1/users/signup').send(DOC);
    const response = await request.post('/api/v1/users/login').send({
      email: DOC.email,
      password: 'wrongPassword',
    });
    expect(response.statusCode).toBe(401);
  });

  it('Should return 401 if email doesnot exist', async () => {
    await request.post('/api/v1/users/signup').send(DOC);
    const response = await request.post('/api/v1/users/login').send({
      email: 'wrongEmail',
      password: DOC.password,
    });
    expect(response.statusCode).toBe(401);
  });
});
