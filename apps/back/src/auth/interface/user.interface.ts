export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface IUser {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  gender: Gender;
  role: UserRole;
  city: string;
  isVerified?: boolean;
  picture?: string | null;
  stripeCustomerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
