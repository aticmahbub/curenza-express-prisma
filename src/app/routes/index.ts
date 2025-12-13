import express, {Router} from 'express';
import {UserRoutes} from '../modules/user/user.routes';
import {AuthRoutes} from '../modules/auth/auth.routes';
import {ScheduleRoutes} from '../modules/schedule/schedule.routes';
import {DoctorScheduleRoutes} from '../modules/doctorSchedule/doctorSchedule.routes';
import {SpecialtiesRoutes} from '../modules/specialties/specialties.routes';
import {DoctorRoutes} from '../modules/doctor/doctor.routes';
import {AppointmentRoutes} from '../modules/appointment/appointment.routes';

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
    {
        path: '/doctor-schedule',
        route: DoctorScheduleRoutes,
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes,
    },
    {
        path: '/doctors',
        route: DoctorRoutes,
    },
    {
        path: '/appointments',
        route: AppointmentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
