import {Router} from 'express';
import {DoctorScheduleController} from './doctorSchedule.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';
import {validateRequest} from '../../middlewares/validateRequest';
import {DoctorScheduleValidation} from './doctorSchedule.validation';

const router = Router();

router.post(
    '/',
    checkAuth(UserRole.DOCTOR),
    validateRequest(
        DoctorScheduleValidation.createDoctorScheduleValidationSchema,
    ),
    DoctorScheduleController.addDoctorSchedule,
);

export const DoctorScheduleRoutes: Router = router;
