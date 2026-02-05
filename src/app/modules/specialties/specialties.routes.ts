import {Router, type NextFunction, type Request, type Response} from 'express';
import {SpecialtiesController} from './specialties.controller';
import {fileUploader} from '../../utils/fileUploader';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';
import {SpecialtiesValidation} from './specialties.validation';

const router = Router();

router.get('/', SpecialtiesController.getAllFromDB);

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidation.create.parse(
            JSON.parse(req.body.data),
        );
        return SpecialtiesController.insertIntoDB(req, res, next);
    },
);

router.delete(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteFromDB,
);

export const SpecialtiesRoutes: Router = router;
