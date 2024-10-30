import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { firstName, lastName, email, password, rut, role } = createUserDto;

    // Validar los campos obligatorios
    if (!firstName || !lastName || !email || !rut || !role || !password) {
        throw new BadRequestException('Todos los campos son obligatorios');
    }

    // Llamar al servicio de usuario para crear el nuevo usuario
    return await this.userService.addNewUser(createUserDto);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
