import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dtos/create-subject.dto';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  //Crear nueva asignatura
  @Post()
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  //Obtener asignatura por nombre
  @Get(':asignatura')
  async getSubjectByName(@Param('asignatura') asignatura: string) {
    return this.subjectService.getSubjectByName(asignatura);
  }

  //Eliminar asignatura por nombre
  @Delete(':asignatura')
  async deleteSubject(@Param('asignatura') asignatura: string) {
    return this.subjectService.deleteSubject(asignatura);
  }

  // Obtener todas las asignaturas
  @Get()
  async getAllSubjects() {
    return this.subjectService.getAllSubjects();
  }
}
