import express, {Router} from 'express';
import {UserRoutes} from '../modules/user/user.routes';
import {AuthRoutes} from '../modules/auth/auth.routes';
import {ScheduleRoutes} from '../modules/schedule/schedule.routes';

const router: Router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/schedule',
        route: ScheduleRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
