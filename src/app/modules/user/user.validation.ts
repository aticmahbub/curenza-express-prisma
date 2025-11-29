import z from 'zod';

const createUserValidationSchema = z.object({
    password: z.string(),
    patient: z.string({error: 'Name should be string'}),
    email: z.email(),
});
