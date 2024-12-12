import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectEntity } from './entity/subject.entity';
import { CreateSubjectDto } from './dtos/create-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  // Crear nueva asignatura
  async createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectEntity> {
    const { asignatura } = createSubjectDto;

    // Verifica si la asignatura ya existe
    const existingSubject = await this.subjectRepository.findOne({ where: { asignatura } });
    if (existingSubject) {
      throw new BadRequestException('La asignatura ya existe');
    }

    // Crear la nueva asignatura
    const newSubject = this.subjectRepository.create(createSubjectDto);
    return this.subjectRepository.save(newSubject);
  }

  // Obtener una asignatura por su nombre
  async getSubjectByName(asignatura: string): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOne({ where: { asignatura } });
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
    return subject;
  }

  // Eliminar asignatura por nombre
  async deleteSubject(asignatura: string): Promise<boolean> {
    const subject = await this.subjectRepository.findOne({ where: { asignatura } });
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }

    // Eliminar la asignatura
    await this.subjectRepository.remove(subject);
    return true;
  }

  //Obtener todas las asignaturas
  async getAllSubjects(): Promise<SubjectEntity[]> {
    return this.subjectRepository.find(); // Devuelve todas las asignaturas
  }

}
