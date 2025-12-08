import z from 'zod';

const createPatientValidationSchema = z.object({
    password: z.string(),
    patient: z.object({
        name: z.string({error: 'Name should be string'}),
        email: z.email(),
        address: z.string().optional(),
    }),
});

const createDoctorValidationSchema = z.object({
    password: z.string(),
    doctor: z.object({
        name: z.string({error: 'Name should be string'}),
        email: z.email(),
        address: z.string().optional(),
        contactNumber: z.string(),
    }),
});

export const UserValidation = {
    createPatientValidationSchema,
    createDoctorValidationSchema,
};
