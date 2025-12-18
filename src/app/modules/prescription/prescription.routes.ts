import {Router} from 'express';
import {PrescriptionController} from './prescription.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';

const router = Router();

router.post(
    '/',
    checkAuth(UserRole.DOCTOR),
    PrescriptionController.createPrescription,
);

export const PrescriptionRoutes: Router = router;
