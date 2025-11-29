import express, {Router} from 'express';
import {UserController} from './user.controller';
import {fileUploader} from '../../utils/fileUploader';
const router = express.Router();

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    UserController.createPatient,
);

export const UserRoutes: Router = router;
