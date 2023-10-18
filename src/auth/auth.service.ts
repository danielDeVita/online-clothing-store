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
import TokenManager from './tokenManager';

@Injectable()
export class AuthService {
  // private tokenManager: TokenManager;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    // this.tokenManager = new TokenManager('LALALA');
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const { password } = registerAuthDto;
    const foundUser = await this.userModel.findOne({
      email: registerAuthDto.email,
    });
    if (foundUser)
      throw new HttpException(
        `Email ${registerAuthDto.email} is already registered`,
        HttpStatus.BAD_REQUEST,
      );
    const hashedPassword = bcrypt.hashSync(password, 10);
    registerAuthDto.password = hashedPassword;
    return await this.userModel.create(registerAuthDto);
  }

  // async login(loginAuthDto: LoginAuthDto) {
  //   const { email } = loginAuthDto;
  //   const foundUser = await this.userModel.findOne({ email });
  //   if (!foundUser)
  //     throw new NotFoundException(`User with email ${email} not found`);
  //   const isValidPassword = bcrypt.compareSync(
  //     loginAuthDto.password,
  //     foundUser.password,
  //   );
  //   if (!isValidPassword)
  //     throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

  //   const payload = { id: foundUser.id, email: foundUser.email };
  //   const token = this.jwtService.sign(payload);

  //   return {
  //     user: { email: foundUser.email, id: foundUser.id },
  //     token,
  //   };
  // }

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

    const token = this.generateToken(foundUser.id);
    console.log('token at login:', token);

    return {
      user: { email: foundUser.email, id: foundUser.id },
      token,
    };
  }

  generateToken(userId: string): string {
    return TokenManager.sign(userId);
  }

  async verifyToken(token: string) {
    if (!token) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    const [data, receivedSignature] = token.split(':');
    const [userId, timestamp] = data.split(':');
    const expectedSignature = TokenManager.sign(userId);

    if (receivedSignature !== expectedSignature) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
