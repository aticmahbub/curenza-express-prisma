import {Router} from 'express';
import {ScheduleController} from './schedule.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';

const router = Router();

router.post('/', ScheduleController.addSchedule);
router.get(
    '/',
    checkAuth(UserRole.ADMIN, UserRole.DOCTOR),
    ScheduleController.schedulesForDoctor,
);
router.delete('/:id', ScheduleController.deleteSchedule);

export const ScheduleRoutes: Router = router;
