import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  /* @ApiProperty()
  @IsString()
  readonly username: string; */
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
  @ApiProperty()
  @IsString()
  readonly firstName: string;
  @ApiProperty()
  @IsString()
  readonly lastName: string;
  @ApiProperty()
  @IsString()
  readonly role: string;
}
