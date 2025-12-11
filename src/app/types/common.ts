import type {UserRole} from '../../generated/enums';

export interface IJWTPayload {
    email: string;
    role: UserRole;
}
