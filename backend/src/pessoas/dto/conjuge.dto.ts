import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class ConjugeDto {
  @IsString()
  nome!: string;

  @IsDateString()
  dataNascimento!: Date;

  @IsOptional()
  @IsBoolean()
  dizimista?: boolean;
}
