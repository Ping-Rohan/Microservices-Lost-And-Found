import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);

describe('POST /api/users/signup', () => {
  it('Should return 201 on successful signup', async () => {
    const response = await request.post('/api/v1/users/signup').send({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    });
    expect(response.statusCode).toBe(201);
  });

  it('Should return 500 with an invalid email', async () => {
    const response = await request.post('/api/v1/users/signup').send({
      username: 'test',
      email: 'test',
      password: 'test',
      confirmPassword: 'test',
    });
    expect(response.statusCode).toBe(500);
  });

  it('Should return 401 if any of the fields are not provided', async () => {
    const response = await request.post('/api/v1/users/signup').send({
      username: 'test',
      email: 'test@gmail.com',
      password: 'test',
    });
    expect(response.statusCode).toBe(500);
  });

  it('Should return 400 if same email is used twice', async () => {
    const DOC = {
      username: 'test',
      email: 'abc@gmail.com',
      password: 'test',
      confirmPassword: 'test',
    };
    await request.post('/api/v1/users/signup').send(DOC);
    const response = await request.post('/api/v1/users/signup').send(DOC);
    expect(response.statusCode).toBe(400);
  });
});
