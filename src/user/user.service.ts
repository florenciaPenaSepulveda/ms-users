import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRoles } from './enums/user-roles.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Añadir un nuevo usuario (solo Admin)
  async addNewUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, role } = createUserDto;

    // Verifica si ya existe un usuario con ese email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El usuario con este email ya existe');
    }

    // Si es Teacher o Admin, verifica que tenga una contraseña
    if ([UserRoles.Teacher, UserRoles.Admin].includes(role) && !password) {
      throw new BadRequestException('Se requiere una contraseña para el rol Teacher o Admin');
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  // Eliminar usuario (solo Admin)
  async deleteUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.remove(user);
    return true;
  }

  // Actualizar usuario (solo Admin)
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(user, updateUserDto);

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    return this.userRepository.save(user);
  }

  // Obtener todos los usuarios (acceso público)
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  // Obtener un usuario por ID (acceso público)
  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  // Obtener un usuario por email
  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }
}
