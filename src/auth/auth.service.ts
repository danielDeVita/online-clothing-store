import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const { password } = registerAuthDto;
    const hashedPassword = bcrypt.hashSync(password, 10);
    registerAuthDto.password = hashedPassword;
    return await this.userModel.create(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email } = loginAuthDto;
    const foundUser = await this.userModel.findOne({ email });
    if (!foundUser)
      throw new NotFoundException(`User with email ${email} not found`);
    const isValidPassword = bcrypt.compareSync(
      loginAuthDto.password,
      foundUser.password,
    );
    if (!isValidPassword)
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    const payload = { id: foundUser.id, email: foundUser.email };
    const token = this.jwtService.sign(payload);

    return {
      user: foundUser,
      token,
    };
  }
}
