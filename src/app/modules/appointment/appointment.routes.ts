import {Router} from 'express';
import {AppointmentController} from './appointment.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';

const router = Router();

router.post(
    '/',
    checkAuth(UserRole.PATIENT),
    AppointmentController.createAppointment,
);

export const AppointmentRoutes: Router = router;
