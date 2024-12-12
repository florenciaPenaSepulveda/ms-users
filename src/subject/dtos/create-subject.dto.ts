import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  asignatura: string;  //nombre de la asignatura(no se debe repetir)
}
