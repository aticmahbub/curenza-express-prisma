import config from '../../../config';
import {UserStatus} from '../../../generated/enums';
import {prisma} from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import {generateToken} from '../../utils/generateToken';
import ApiError from '../../errorHelpers/ApiError';
import {verifyToken} from '../../utils/verifyToken';
import type {Secret} from 'jsonwebtoken';

const login = async (payload: {email: string; password: string}) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {email: payload.email, status: UserStatus.ACTIVE},
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        user.password,
    );

    if (!isCorrectPassword) {
        throw new ApiError(400, 'Incorrect password');
    }

    const accessToken = generateToken(
        {email: payload.email, role: user.role},
        config.jwt.jwt_access_secret,
        config.jwt.jwt_access_expires,
    );
    const refreshToken = generateToken(
        {email: payload.email, role: user.role},
        config.jwt.jwt_refresh_secret,
        config.jwt.jwt_refresh_expires,
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
};

const getMe = async (session: any) => {
    const decodedData = verifyToken(
        session.accessToken,
        config.jwt.jwt_access_secret as Secret,
    );

    const userData = await prisma.user.findUniqueOrThrow({
        where: {email: decodedData.email, status: UserStatus.ACTIVE},
    });

    const {id, email, role, needPasswordChange, status} = userData;

    return {id, email, role, needPasswordChange, status};
};
export const AuthService = {login, getMe};
