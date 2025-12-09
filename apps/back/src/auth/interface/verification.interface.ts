export interface IEmailVerification {
    id?: string;
    userId: string;
    code: string;
    purpose: EmailVerificationPurpose;
    expiredAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum EmailVerificationPurpose {
    RESET = 'reset',
    VERIFY = 'verify',
}