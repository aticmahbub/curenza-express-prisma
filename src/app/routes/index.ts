import express, {Router} from 'express';

const router: Router = express.Router();

const moduleRoutes = [
    {
        path: '/',
        route: router,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
