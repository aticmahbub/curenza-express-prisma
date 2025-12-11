import {Router} from 'express';
import {DoctorController} from './doctor.controller';

const router = Router();

router.get('/', DoctorController.getDoctors);
router.patch('/:id', DoctorController.updateDoctor);

export const DoctorRoutes: Router = router;
