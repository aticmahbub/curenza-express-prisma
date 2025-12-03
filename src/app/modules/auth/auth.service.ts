import config from '../../../config';
import {UserStatus} from '../../../generated/enums';
import {prisma} from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const accessToken = jwt.sign(
        {email: user.email, role: user.email},
        config.jwt.jwt_access_secret,
        {algorithm: 'HS256', expiresIn: '1h'},
    );

    const refreshToken = jwt.sign(
        {email: user.email, role: user.email},
        config.jwt.jwt_refresh_secret,
        {algorithm: 'HS256', expiresIn: '90d'},
    );
    console.log(accessToken);

    return {accessToken, refreshToken};
};

export const AuthService = {login};
