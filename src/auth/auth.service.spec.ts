import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn().mockImplementation((dto: RegisterAuthDto) => Promise.resolve(dto)),
    login: jest.fn().mockImplementation((dto: LoginAuthDto) =>
      Promise.resolve({
        user: { email: dto.email, password: dto.password },
        token: 'some token',
      }),
    ),
  };

  const mockRegisterDto: RegisterAuthDto = {
    name: 'test name',
    password: 'test Password',
    email: 'testMail@gmail.com',
  };
  const mockLoginDto: LoginAuthDto = { password: 'test Password', email: 'testMail@gmail.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    expect(await service.register(mockRegisterDto)).toEqual({
      password: 'test Password',
      email: 'testMail@gmail.com',
      name: 'test name',
    });
  });

  it('should login a user', async () => {
    expect(await service.login(mockLoginDto)).toEqual({
      user: { email: 'testMail@gmail.com', password: 'test Password' },
      token: 'some token',
    });
  });
});
