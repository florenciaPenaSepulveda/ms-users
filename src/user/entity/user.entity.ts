import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { UserRoles } from '../enums/user-roles.enum';
import { SubjectEntity } from '../../subject/entity/subject.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  rut: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.Student, // Por defecto, todos los usuarios son estudiantes
  })
  role: UserRoles;
  
  @ManyToMany(() => SubjectEntity, { eager: true }) // Carga automática de asignaturas
  @JoinTable() // Crea una tabla intermedia para usuarios y asignaturas
  subjects: SubjectEntity[];
}
