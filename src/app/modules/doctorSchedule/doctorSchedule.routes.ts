import {Router} from 'express';
import {DoctorScheduleController} from './doctorSchedule.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';

const router = Router();

router.post(
    '/',
    checkAuth(UserRole.DOCTOR),
    DoctorScheduleController.addDoctorSchedule,
);

export const DoctorScheduleRoutes: Router = router;
