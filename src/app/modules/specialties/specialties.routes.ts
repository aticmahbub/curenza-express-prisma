import {Router, type NextFunction, type Request, type Response} from 'express';
import {SpecialtiesController} from './specialties.controller';
import {fileUploader} from '../../utils/fileUploader';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';
import {SpecialtiesValidation} from './specialties.validation';

const router = Router();

// Task 1: Retrieve Specialties Data

/**
- Develop an API endpoint to retrieve all specialties data.
- Implement an HTTP GET endpoint returning specialties in JSON format.
- ENDPOINT: /specialties
*/
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

// Task 2: Delete Specialties Data by ID

/**
- Develop an API endpoint to delete specialties by ID.
- Implement an HTTP DELETE endpoint accepting the specialty ID.
- Delete the specialty from the database and return a success message.
- ENDPOINT: /specialties/:id
*/

router.delete(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteFromDB,
);

export const SpecialtiesRoutes: Router = router;
