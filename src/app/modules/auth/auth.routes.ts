import express, {
    Router,
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import {AuthController} from './auth.controller';
const router = express.Router();

router.post('/login', AuthController.login);

export const AuthRoutes: Router = router;
