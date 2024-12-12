import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subjects')
export class SubjectEntity {
  @PrimaryGeneratedColumn()
  id: number;  

  @Column({ unique: true })
  asignatura: string; 
}
