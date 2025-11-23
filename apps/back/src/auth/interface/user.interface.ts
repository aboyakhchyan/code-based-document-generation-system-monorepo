export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface IUser {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  gender: Gender;
  role: UserRole;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
