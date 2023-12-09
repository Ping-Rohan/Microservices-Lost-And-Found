import express from 'express';
import {
  register,
  login,
  currentUser,
  logout,
  verifyAccount,
} from '../ Controller/User-Controller';
import { protectRoute } from '@codishrohan/common';
const Router = express.Router();

Router.post('/login', login);
Router.post('/signup', register);
Router.get('/currentuser', protectRoute, currentUser);
Router.post('/logout', logout);
Router.post('/verify/:token', verifyAccount);

export { Router as AuthRoute };
