export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

export enum Gender {
    MALE = 'male',
    EMALE = 'emale'
}

export interface IUser {
    id?: number
    fullName: string,
    age: number,
    phoneNumber: string
    email: string
    gender: Gender
    picture?: string | null
    role: UserRole
    password?: string
}
