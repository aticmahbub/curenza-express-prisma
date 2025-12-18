import {Router} from 'express';
import {ReviewController} from './review.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import {UserRole} from '../../../generated/enums';

const router = Router();

router.post('/', checkAuth(UserRole.PATIENT), ReviewController.createReview);

export const ReviewRoutes: Router = router;
