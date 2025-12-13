import type {Doctor, Prisma} from '../../../generated/client';
import {prisma} from '../../../lib/prisma';
import {calculatePagination} from '../../utils/pagination';
import {doctorSearchableFields} from './doctor.constants';
import type {IDoctorUpdateInput} from './doctor.interface';

const getDoctors = async (filters, options) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {search, specialties, ...filterData} = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {contains: search, mode: 'insensitive'},
            })),
        });
    }

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {contains: specialties, mode: 'insensitive'},
                    },
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {equals: (filterData as any)[key]},
        }));

        andConditions.push(...filterConditions);
    }
    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {[sortBy]: sortOrder},
        include: {doctorSpecialties: {include: {specialties: true}}},
    });

    const total = await prisma.doctor.count({where: whereConditions});

    return {meta: {total, page, limit}, data: result};
};

const updateDoctor = async (
    id: string,
    payload: Partial<IDoctorUpdateInput>,
) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({where: {id}});

    const {specialties, ...doctorData} = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length! > 0) {
            const deleteSpecialtyIds = specialties.filter(
                (specialty) => specialty.isDeleted,
            );

            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {doctorId: id, specialtiesId: specialty.specialtyId},
                });
            }

            const createdSpecialtyIds = specialties.filter(
                (specialty) => !specialty.isDeleted,
            );

            for (const specialty of createdSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {doctorId: id, specialtiesId: specialty.specialtyId},
                });
            }
        }
        const updatedData = await tnx.doctor.update({
            where: {id: doctorInfo.id},
            data: doctorData,
            include: {doctorSpecialties: {include: {specialties: true}}},
        });

        return updatedData;
    });
};

export const DoctorService = {getDoctors, updateDoctor};
