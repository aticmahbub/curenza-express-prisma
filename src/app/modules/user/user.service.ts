import config from '../../../config';
import bcrypt from 'bcryptjs';
import {prisma} from '../../../lib/prisma';
import type {Request} from 'express';
import {fileUploader} from '../../utils/fileUploader';
import {UserRole} from '../../../generated/enums';

const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);

        req.body.patient.profilePhoto = uploadResult?.secure_url;
    }
    const hashedPassword = await bcrypt.hash(
        req.body.password,
        Number(config.bcrypt_js_salt_round),
    );

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {email: req.body.patient.email, password: hashedPassword},
        });

        return await tnx.patient.create({
            data: req.body.patient,
        });
    });
    return result;
};

const createDoctor = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url;
    }
    const hashedPassword = await bcrypt.hash(
        req.body.password,
        Number(config.bcrypt_js_salt_round),
    );

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
    };

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: userData,
        });

        const createdDoctorData = await tnx.doctor.create({
            data: req.body.doctor,
        });
        return createdDoctorData;
    });
    return result;
};

const getALlUsers = async ({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
}: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: string;
}) => {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;

    const skip = (pageNumber - 1) * limitNumber;
    const result = await prisma.user.findMany({
        skip,
        take: limitNumber,
        where: {email: {contains: search, mode: 'insensitive'}},
        orderBy:
            sortBy && sortOrder ? {[sortBy]: sortOrder} : {createdAt: 'desc'},
    });
    return result;
};

export const UserService = {createPatient, createDoctor, getALlUsers};
