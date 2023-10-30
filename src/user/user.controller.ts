import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: `This api used to create a new user`,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'get all users',
    description: `this api is used for get all the existing users`,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get single user by id',
    description: `this api will be used to fetch one particular user using its unique ID`,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: `this API is use to update an existing user`,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete user',
    description: `this API is used to delete any existing user`,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
