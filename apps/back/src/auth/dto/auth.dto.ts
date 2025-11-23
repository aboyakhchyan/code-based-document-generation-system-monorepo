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
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @IsString()
  @IsOptional()
  picture?: string;
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

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;
}
