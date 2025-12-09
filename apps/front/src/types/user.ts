export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum Gender {
  MALE = "male",
  EMALE = "emale",
}

export interface IUser {
  id?: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  email: string;
  gender: Gender;
  picture?: string | null;
  role: UserRole;
  password?: string;
  isVerified: boolean;
  isSubscribed: boolean;
}
