import type {Gender} from '../../../generated/enums';

export interface IDoctorUpdateInput {
    email: string;
    contactNumber: string;
    gender: Gender;
    appointmentFee: number;
    name: string;
    address: string | null;
    registrationNumber: string | null;
    experience: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        [x: string]: number;
        specialtyId: string;
        isDeleted?: boolean;
    };
}
