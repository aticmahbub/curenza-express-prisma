import config from '../../../config';
import bcrypt from 'bcryptjs';
import {prisma} from '../../../lib/prisma';
import type {Request} from 'express';
import {fileUploader} from '../../utils/fileUploader';
import {UserRole} from '../../../generated/enums';
import {calculatePagination} from '../../utils/pagination';
import type {Prisma} from '../../../generated/client';
import {userSearchableFields} from './user.constants';

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

const createAdmin = async (req: Request) => {
    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData,
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin,
        });

        return createdAdminData;
    });

    return result;
};

const getALlUsers = async (params, options) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {search, ...filterData} = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: userSearchableFields.map((field) => ({
                [field]: {contains: search, mode: 'insensitive'},
            })),
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0
            ? {
                  AND: andConditions,
              }
            : {};

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {equals: (filterData as any)[key]},
            })),
        });
    }

    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.user.count({where: whereConditions});

    return {meta: {page, limit, total}, data: result};
};

export const UserService = {
    createPatient,
    createDoctor,
    createAdmin,
    getALlUsers,
};
