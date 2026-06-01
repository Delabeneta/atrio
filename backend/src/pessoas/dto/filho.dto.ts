import { IsDateString, IsString } from 'class-validator';

export class FilhoDto {
  @IsString()
  nome!: string;

  @IsDateString()
  dataNascimento!: Date;
}
