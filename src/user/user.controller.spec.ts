import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto: CreateUserDto) => dto),
    update: jest.fn((id: string, dto: UpdateUserDto) => ({
      id,
      ...dto,
    })),
    findAll: jest.fn(() => [mockUser, mockUser]),
    findOne: jest.fn((id: string) => ({ id, ...mockUser })),
    remove: jest.fn((id: string) => ({ message: 'User deleted', user: { id, ...mockUser } })),
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
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    expect(controller.create(mockUser)).toEqual({
      email: 'test@mail.com',
      password: '12345',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'admin',
    });
  });

  it('should return all users', () => {
    expect(controller.findAll()).toEqual([mockUser, mockUser]);
  });

  it('should return one user by id', () => {
    expect(controller.findOne('1')).toEqual({
      id: '1',
      email: 'test@mail.com',
      password: '12345',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'admin',
    });
  });

  it('should update a user', () => {
    expect(controller.update('1', mockUpdateUser)).toEqual({
      email: 'another@email.com',
      id: '1',
      role: 'user',
    });
  });

  it('should remove a user by id', () => {
    expect(controller.remove('1')).toEqual({
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
