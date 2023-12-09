import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  email: string;
}

function issueJWT(payload: Payload) {
  return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: '1d' });
}

export { issueJWT };
