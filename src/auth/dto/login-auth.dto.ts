import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
