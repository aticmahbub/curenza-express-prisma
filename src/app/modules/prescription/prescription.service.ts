import {
    AppointmentStatus,
    PaymentStatus,
    UserRole,
} from '../../../generated/enums';
import {prisma} from '../../../lib/prisma';
import ApiError from '../../errorHelpers/ApiError';
import {calculatePagination} from '../../utils/pagination';

const createPrescription = async (user, payload) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID,
        },
        include: {doctor: true},
    });

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(502, 'This is not your appointment');
        }
    }

    return await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions,
            followUpDate: payload.followUpDate || undefined,
        },
        include: {patient: true},
    });
};

const patientPrescription = async (user, options) => {
    const {limit, page, skip, sortOrder, sortBy} = calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {patient: {email: user.email}},
        skip,
        take: limit,
        orderBy: {[sortBy]: sortOrder},
        include: {doctor: true, patient: true, appointment: true},
    });

    const total = await prisma.prescription.count({
        where: {patient: {email: user.email}},
    });
    return {meta: {total, page, limit}, data: result};
};

export const PrescriptionService = {createPrescription, patientPrescription};
