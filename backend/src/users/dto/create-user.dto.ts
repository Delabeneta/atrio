import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  @IsEnum(['admin', 'member'])
  role?: string;
}
