import {prisma} from '../../../lib/prisma';
import ApiError from '../../errorHelpers/ApiError';

const createReview = async (user, payload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {email: user.email},
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {id: payload.appointmentId},
    });

    if (patientData.id !== appointmentData.patientId) {
        throw new ApiError(502, 'This is not your appointment');
    }

    return prisma.$transaction(async (tnx) => {
        const result = await tnx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment,
            },
        });
        const avgRating = await tnx.review.aggregate({
            _avg: {rating: true},
            where: {doctorId: appointmentData.doctorId},
        });

        await tnx.doctor.update({
            where: {id: appointmentData.doctorId},
            data: {averageRating: avgRating._avg.rating as number},
        });
        return result;
    });
};

export const ReviewService = {createReview};
