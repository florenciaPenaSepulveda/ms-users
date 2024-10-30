import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from './enums/user-roles.enum';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @Roles(UserRoles.Admin)
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

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(parseInt(id));
  }
}
