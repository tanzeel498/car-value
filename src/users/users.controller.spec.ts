import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('Users Contoller', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asd@test.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      // update: (id: number, attrs: Partial<User>) => {},
      // remove: (id: number) => {},
    };

    fakeAuthService = {
      // signup: (email: string, password: string) => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 19, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('asf@test.co');

    expect(users.length).toEqual(1);
    expect(users.at(0).email).toEqual('asf@test.co');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser(34);

    expect(user).toBeDefined();
  });

  it('findUser throws if user with provided id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser(324)).rejects.toThrow(NotFoundException);
  });

  it('signinUser updates session and returns user', async () => {
    const session = { userId: null };
    const user = await controller.signinUser(
      { email: 'asd@test.co', password: 'asdf' },
      session,
    );

    expect(user.id).toEqual(19);
    expect(session.userId).toEqual(19);
  });
});
