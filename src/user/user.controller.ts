import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Patch, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from './enums/user-roles.enum';

@Controller('user')
//@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.Admin)
  async createUserAdmin(@Body() createUserDto: CreateUserDto) {
    return this.userService.addNewUser(createUserDto);
  }

  @Post('create/noAdmin')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.addNewUser(createUserDto);
  }

  @Delete('delete/:id')
  @Roles(UserRoles.Admin)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(parseInt(id));
  }

  @Put('update/:id')
  @Roles(UserRoles.Admin)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(parseInt(id), updateUserDto);
  }

  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  //gettear all students
  @Get('students')
  async getAllStudent() {
    return this.userService.getAllStudents()
  }


  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(parseInt(id));
  }

  //endpoint para asignar una asignatura a un usuario(por id) por nombre de asignatura(por nombre)
  //usado para estudiantes, basicamente inscribirle los ramos
  //usado para profesores, indicando que asignaturas las da dicho profesor
  //(usado para ver respuestas podemos iterar sobre las asignaturas 
  // y preguntar al back que encuestas tienen el id del profesor)
  @Patch(':userId/assign-subject/:subjectName')
  async assignSubjectToStudentOrTeacher(
    @Param('userId') userId: number,
    @Param('subjectName') subjectName: string,
  ) {
    return this.userService.assignSubjectByName(userId, subjectName);
  }


   //endpoint para quitar una asignatura a un usuario(por id) por nombre de asignatura
   @Patch(':userId/remove-subject/:subjectName')
   async removeSubjectFromStudent(
     @Param('userId') userId: number,
     @Param('subjectName') subjectName: string,
   ) {
     return this.userService.removeSubjectByName(userId, subjectName);
   }

  //retorna las asignaturas de un profe o estudiante
  @Get(':userId/subjects')
  async getSubjectsForTeacher(@Param('userId') userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user || user.role === UserRoles.Admin) {
      throw new NotFoundException('Profesor o estudiante no encontrado');
    }
    return user.subjects;
  }

  // Endpoint para obtener los estudiantes por asignatura
  @Get('students/subject/:subject')
  async getAllStudentsBySubject(@Param('subject') subject: string) {
    return await this.userService.getAllStudentsBySubject(subject);
  }

}
