import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module'; // Asegúrate de tener este módulo
import { AuthModule } from './auth/auth.module'; // Módulo de autenticación

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Cambia esto según tu configuración
      port: 5432,        // Puerto de PostgreSQL
      username: 'flo',
      password: 'pass123',
      database: 'usersDB',
      autoLoadEntities: true, // Cargará las entidades automáticamente
      synchronize: true, // Solo para desarrollo. ¡Desactívalo en producción!
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
