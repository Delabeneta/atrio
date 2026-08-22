import {
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  nome!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
