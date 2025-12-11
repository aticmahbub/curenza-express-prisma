import {Router} from 'express';
import {DoctorController} from './doctor.controller';

const router = Router();

router.get('/', DoctorController.getDoctors);

export const DoctorRoutes: Router = router;
