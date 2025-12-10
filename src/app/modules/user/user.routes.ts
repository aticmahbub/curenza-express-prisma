import express, {
    Router,
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import {UserController} from './user.controller';
import {fileUploader} from '../../utils/fileUploader';
import {UserValidation} from './user.validation';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';
const router = express.Router();

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientValidationSchema.parse(
            JSON.parse(req.body.data),
        );
        return UserController.createPatient(req, res, next);
    },
);

router.post(
    '/create-doctor',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createDoctorValidationSchema.parse(
            JSON.parse(req.body.data),
        );
        return UserController.createDoctor(req, res, next);
    },
);

router.get('/users', checkAuth(UserRole.ADMIN), UserController.getALlUsers);

export const UserRoutes: Router = router;
