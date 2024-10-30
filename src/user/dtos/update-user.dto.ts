import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoles } from '../enums/user-roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
