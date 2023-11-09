import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto: CreateUserDto) => Promise.resolve(dto)),
    findAll: jest.fn().mockImplementation(() => Promise.resolve([mockUser, mockUser])),
    findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ id, ...mockUser })),
    update: jest.fn().mockImplementation((id: string, dto: UpdateUserDto) =>
      Promise.resolve({
        id,
        ...dto,
      }),
    ),
    remove: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ message: 'User deleted', user: { id, ...mockUser } }),
      ),
  };

  const mockUser: CreateUserDto = {
    email: 'test@mail.com',
    password: '12345',
    firstName: 'firstName',
    lastName: 'lastName',
    role: 'admin',
  };

  const mockUpdateUser: UpdateUserDto = {
    email: 'another@email.com',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserRepository)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return it', async () => {
    expect(await service.create(mockUser)).toEqual({
      email: 'test@mail.com',
      password: '12345',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'admin',
    });
  });

  it('should return all users', async () => {
    expect(await service.findAll()).toEqual([mockUser, mockUser]);
  });

  it('should return one user by id', async () => {
    expect(await service.findOne('1')).toEqual({
      id: '1',
      email: 'test@mail.com',
      password: '12345',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'admin',
    });
  });

  it('should update a user', async () => {
    expect(await service.update('1', mockUpdateUser)).toEqual({
      email: 'another@email.com',
      id: '1',
      role: 'user',
    });
  });

  it('should remove a user by id', async () => {
    expect(await service.remove('1')).toEqual({
      message: 'User deleted',
      user: {
        id: '1',
        email: 'test@mail.com',
        password: '12345',
        firstName: 'firstName',
        lastName: 'lastName',
        role: 'admin',
      },
    });
  });
});
