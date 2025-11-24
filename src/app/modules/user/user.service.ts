import config from '../../../config';
import bcrypt from 'bcryptjs';
import type {CreatePatientInput} from './user.types';

const createPatient = async (payload: CreatePatientInput) => {
    return payload;
};

export const UserService = {createPatient};
