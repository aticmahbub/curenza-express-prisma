import {
    AppointmentStatus,
    PaymentStatus,
    UserRole,
} from '../../../generated/enums';
import {prisma} from '../../../lib/prisma';
import ApiError from '../../errorHelpers/ApiError';

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

export const PrescriptionService = {createPrescription};
