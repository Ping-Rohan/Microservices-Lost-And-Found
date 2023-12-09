import express from 'express';
import cookieParser from 'cookie-parser';
import { ItemRoutes } from './Routes/ItemRoutes';
import { errorHandler } from '@codishrohan/common';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/items', ItemRoutes);
app.use(errorHandler);

export { app };
