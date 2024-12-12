import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { SubjectEntity } from 'src/subject/entity/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,SubjectEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
