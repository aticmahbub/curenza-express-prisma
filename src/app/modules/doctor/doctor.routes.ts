import {Router} from 'express';
import {DoctorController} from './doctor.controller';

const router = Router();

router.get('/', DoctorController.getDoctors);
router.post('/ai-doctor-suggestion', DoctorController.aiDoctorSuggestion);
router.patch('/:id', DoctorController.updateDoctor);

export const DoctorRoutes: Router = router;
