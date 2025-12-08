import config from '../../../config';
import {UserStatus} from '../../../generated/enums';
import {prisma} from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {generateToken} from '../../utils/generateToken';

const login = async (payload: {email: string; password: string}) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {email: payload.email, status: UserStatus.ACTIVE},
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        user.password,
    );

    if (!isCorrectPassword) {
        throw new Error('Incorrect password');
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

export const AuthService = {login};
