import express from 'express';
import { AuthRoute } from './Routes/Auth-Route';
import cookieParser from 'cookie-parser';
import { errorHandler } from '@codishrohan/common';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', AuthRoute);
app.use(errorHandler);

export { app };
