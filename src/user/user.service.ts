import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRoles } from './enums/user-roles.enum';
import * as bcrypt from 'bcryptjs';
import { SubjectEntity } from 'src/subject/entity/subject.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  // Añadir un nuevo usuario (solo Admin)
  async addNewUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const {  email, password, role, rut, firstName, lastName  } = createUserDto;

    // Verifica si ya existe un usuario con ese email
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El usuario con este email ya existe');
    }

     // Verificar si ya existe un usuario con ese rut
    const existingRutUser = await this.userRepository.findOne({ where: { rut } });
    if (existingRutUser) {
      throw new BadRequestException('El usuario con este RUT ya existe');
    }

    // Verificar si ya existe un usuario con ese nombre y apellido
    const existingNameUser = await this.userRepository.findOne({ where: { firstName, lastName } });
    if (existingNameUser) {
      throw new BadRequestException('Ya existe un usuario con ese nombre y apellido');
    }

    // Si es Teacher o Admin, verifica que tenga una contraseña
    if ([UserRoles.Teacher, UserRoles.Admin].includes(role) && !password) {
      throw new BadRequestException('Se requiere una contraseña para el rol Teacher o Admin');
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    let subjectsEntities: SubjectEntity[] = [];
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      subjects: subjectsEntities
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

  async assignSubjectsToStudent(userId: number, subjectId: number): Promise<UserEntity> {
    // Buscar al usuario con el rol "Estudiante" y cargar sus asignaturas
    const user = await this.userRepository.findOne({
      where: { id: userId, role: UserRoles.Student },
      relations: ['subjects'],
    });
  
    if (!user) {
      throw new NotFoundException('Estudiante no encontrado');
    }
  
    // Buscar la asignatura en la base de datos
    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } });
  
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
  
    // Verificar si la asignatura ya está asociada al estudiante
    const isSubjectAlreadyAssigned = user.subjects.some(sub => sub.id === subject.id);
  
    if (isSubjectAlreadyAssigned) {
      throw new BadRequestException('La asignatura ya está asignada a este estudiante');
    }
  
    // Agregar la asignatura al arreglo de asignaturas del estudiante
    user.subjects.push(subject);
  
    // Guardar los cambios en la base de datos
    return this.userRepository.save(user);
  }
  
  async assignSubjectByName(userId: number, subjectName: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId,  role: In([UserRoles.Teacher, UserRoles.Student]) },
      relations: ['subjects'],
    });
  
    if (!user) {
      throw new NotFoundException('Estudiante o profesor no encontrado');
    }
  
    const subject = await this.subjectRepository.findOne({ where: { asignatura: subjectName } });
  
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
  
    // Verificar si la asignatura ya está asignada
    const isSubjectAlreadyAssigned = user.subjects.some(sub => sub.asignatura === subject.asignatura);
  
    if (isSubjectAlreadyAssigned) {
      throw new BadRequestException('La asignatura ya está asignada a este estudiante');
    }
  
    user.subjects.push(subject);
  
    return this.userRepository.save(user);
  }
  
  async removeSubjectByName(userId: number, subjectName: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId,  role: In([UserRoles.Teacher, UserRoles.Student]) },
      relations: ['subjects'],
    });
    if (!user) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const subject = await this.subjectRepository.findOne({ where: { asignatura: subjectName } });
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
    // Verificar si la asignatura está asociada al estudiante
    const isSubjectAssigned = user.subjects.some(sub => sub.asignatura === subject.asignatura);
    if (!isSubjectAssigned) {
      throw new BadRequestException('La asignatura no está asignada a este estudiante');
    }
    // Eliminar la asignatura del arreglo de asignaturas del estudiante
    user.subjects = user.subjects.filter(sub => sub.asignatura !== subject.asignatura);
    return this.userRepository.save(user);
  }
  


}
