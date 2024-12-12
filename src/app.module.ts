import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module'; // Asegúrate de tener este módulo
import { AuthModule } from './auth/auth.module'; // Módulo de autenticación
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Cambia esto según tu configuración
      port: 5432,        // Puerto de PostgreSQL
      username: 'postgres',
      password: 'postgres',
      database: 'ingeso2',
      autoLoadEntities: true, // Cargará las entidades automáticamente
      synchronize: true, // Solo para desarrollo. ¡Desactívalo en producción!
    }),
    UserModule,
    AuthModule,
    SubjectModule,
  ],
})
export class AppModule {}
