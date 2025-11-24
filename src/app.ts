import express from 'express';
import type {Application, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import {uptime} from 'process';
import {timeStamp} from 'console';

const app: Application = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Curenza server is up running..',
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + ' sec',
        timeStamp: new Date().toISOString(),
    });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
