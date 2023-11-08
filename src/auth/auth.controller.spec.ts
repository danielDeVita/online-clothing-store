import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn((dto: RegisterAuthDto) => dto),
    login: jest.fn((dto: LoginAuthDto) => ({
      user: { email: dto.email, password: dto.password },
      token: 'some token',
    })),
  };

  const mockRegisterDto: RegisterAuthDto = {
    name: 'test name',
    password: 'test Password',
    email: 'testMail@gmail.com',
  };
  const mockLoginDto: LoginAuthDto = { password: 'test Password', email: 'testMail@gmail.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', () => {
    expect(controller.registerUser(mockRegisterDto)).toEqual({
      password: 'test Password',
      email: 'testMail@gmail.com',
      name: 'test name',
    });
  });

  it('should login a user', () => {
    expect(controller.loginUser(mockLoginDto)).toEqual({
      user: { email: 'testMail@gmail.com', password: 'test Password' },
      token: 'some token',
    });
  });
});
