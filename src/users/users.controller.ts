import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    this.service.create(body.email, body.password);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    console.log('I am running from within the controller');
    const user = await this.service.findOne(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.service.find(email);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
