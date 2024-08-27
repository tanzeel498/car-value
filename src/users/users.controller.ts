import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(public usersService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    console.log(body);
  }
}
