import type {ChatResponse} from '@openrouter/sdk/esm/models';
import type {Doctor, Prisma} from '../../../generated/client';
import {openRouter} from '../../../lib/openRouter';
import {prisma} from '../../../lib/prisma';
import ApiError from '../../errorHelpers/ApiError';
import {calculatePagination} from '../../utils/pagination';
import {doctorSearchableFields} from './doctor.constants';
import type {IDoctorUpdateInput} from './doctor.interface';
import {extractJsonFromMessage} from '../../utils/extratctJSONFromMessage';

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
        include: {
            doctorSpecialties: {include: {specialties: true}},
            reviews: true,
        },
    });

    const total = await prisma.doctor.count({where: whereConditions});

    return {meta: {total, page, limit}, data: result};
};

const getDoctorById = async (id: string) => {
    const doctor = prisma.doctor.findUniqueOrThrow({
        where: {id, isDeleted: false},
        include: {
            doctorSpecialties: {include: {specialties: true}},
            doctorSchedules: {include: {schedule: true}},
            reviews: true,
        },
    });

    if (!doctor) {
        throw new ApiError(404, 'Doctor is not found');
    }

    return doctor;
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

const aiDoctorSuggestion = async (payload: {symptoms: string}) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(400, 'Symptoms are required');
    }

    const doctors = await prisma.doctor.findMany({
        where: {isDeleted: false},
        include: {doctorSpecialties: {include: {specialties: true}}},
    });

    const prompt = `You are a medical assistant AI. Based on the patient's symptoms, suggest top 3 suitable doctors.
    Each doctor has specialties and years of experience.
    Only suggest doctors who are relevant to the given symptoms.

    Symptoms:${payload.symptoms}

    Here is the doctor list in JSON format:
    ${JSON.stringify(doctors, null, 2)}

    Return your response in JSON format with full individual doctor data
    `;

    const completion: ChatResponse = await openRouter.chat.send({
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [
            {
                role: 'system',
                content:
                    'You are helpful medical AI Assistant that provides doctor suggestion',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        stream: false,
    });

    const result = await extractJsonFromMessage(completion.choices[0].message);

    return result;
};

export const DoctorService = {
    getDoctors,
    getDoctorById,
    updateDoctor,
    aiDoctorSuggestion,
};
