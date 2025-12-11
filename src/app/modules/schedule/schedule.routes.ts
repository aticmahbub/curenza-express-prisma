import {Router} from 'express';
import {ScheduleController} from './schedule.controller';

const router = Router();

router.post('/', ScheduleController.addSchedule);
router.get('/', ScheduleController.schedulesForDoctor);
router.delete('/:id', ScheduleController.deleteSchedule);

export const ScheduleRoutes: Router = router;
