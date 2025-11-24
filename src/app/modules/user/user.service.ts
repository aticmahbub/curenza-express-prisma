import config from '../../../config';
import bcrypt from 'bcryptjs';
import type {CreatePatientInput} from './user.types';
import {prisma} from '../../../lib/prisma';

const createPatient = async (payload: CreatePatientInput) => {
    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_js_salt_round),
    );

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {email: payload.email, password: hashedPassword},
        });

        return await tnx.patient.create({
            data: {name: payload.name, email: payload.email},
        });
    });
    return result;
};

export const UserService = {createPatient};
