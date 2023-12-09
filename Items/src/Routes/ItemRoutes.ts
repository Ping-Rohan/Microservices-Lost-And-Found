import express from 'express';
import { protectRoute } from '@codishrohan/common';
import { registerItem, getSingleItem } from '../Controller/Item-Controller';

const Router = express.Router();

Router.post('/register', protectRoute, registerItem);
Router.get('/:id', protectRoute, getSingleItem);

export { Router as ItemRoutes };
