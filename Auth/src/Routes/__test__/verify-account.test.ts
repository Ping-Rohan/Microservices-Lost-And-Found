import supertest from 'supertest';
import { app } from '../../app';

const request = supertest(app);

const VERIFICATION_TOKEN_SLASHES = 5;

const DOC = {
  username: 'test',
  email: 'abc@gmail.com',
  password: 'test',
  confirmPassword: 'test',
};

describe('POST /api/users/verify/:token', () => {
  it('Should return 200 on successful verification', async () => {
    const response = await request.post('/api/v1/users/signup').send(DOC);
    const { verificationLink } = response.body;
    const verificationToken =
      verificationLink.split('/')[VERIFICATION_TOKEN_SLASHES];

    const verificationResponse = await request
      .post(`/api/v1/users/verify/${verificationToken}`)
      .send({});
    console.log(verificationResponse.body);
    expect(verificationResponse.statusCode).toBe(200);
  });
});
