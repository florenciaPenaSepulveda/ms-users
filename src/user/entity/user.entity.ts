import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRoles } from '../enums/user-roles.enum';

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
}
