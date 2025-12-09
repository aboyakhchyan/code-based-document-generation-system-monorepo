import { Gender, UserRole } from '@auth/interface';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
  Matches,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNonEmptyString } from '@common/decorators';

export class RegisterDto {
  @IsNonEmptyString()
  fullName: string;

  @IsNonEmptyString()
  @IsEmail()
  email: string;

  @IsNonEmptyString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @Type(() => Number)
  @IsInt()
  @Min(14)
  @Max(150)
  age: number;

  @IsEnum(Gender, {
    message: 'Gender must be either "male" or "female"',
  })
  gender: Gender;

  @IsEnum(UserRole, {
    message: 'Role must be either "user" or "admin"',
  })
  role: UserRole;

  @IsNonEmptyString()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, {
    message: 'Phone number format is invalid',
  })
  phone: string;

  @IsString()
  @IsOptional()
  city: string;
}

export class LoginDto {
  @IsNonEmptyString()
  @IsEmail()
  email: string;

  @IsNonEmptyString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class VerifyDto {
  @IsNonEmptyString()
  @IsString()
  @Matches(/^\d{4}$/, {
    message: 'Verification code must be exactly 4 digits',
  })
  code: string;
}
