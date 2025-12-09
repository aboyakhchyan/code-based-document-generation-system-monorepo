import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNonEmptyString } from '@common/decorators';
import { Gender } from '@auth/interface';

export class EditUserDto {
  @IsNonEmptyString()
  @IsOptional()
  fullName?: string;

  @IsNonEmptyString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Type(() => Number)
  @IsInt()
  @Min(14)
  @Max(150)
  @IsOptional()
  age?: number;

  @IsEnum(Gender, {
    message: 'Gender must be either "male" or "female"',
  })
  @IsOptional()
  gender?: Gender;

  @IsNonEmptyString()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, {
    message: 'Phone number format is invalid',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  city?: string;
}
