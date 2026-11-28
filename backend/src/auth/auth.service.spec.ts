import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

describe('AuthService.register', () => {
  const dto: RegisterDto = {
    email: 'minh@example.com',
    password: 'matkhau123',
    fullName: 'Minh',
  };

  const users = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const service = new AuthService(users as unknown as UsersService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('hashes the password with argon2id and creates the user', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockImplementation((data: { email: string }) =>
      Promise.resolve({ id: 'u1', email: data.email }),
    );

    await service.register(dto);

    expect(users.create).toHaveBeenCalledTimes(1);
    const arg = users.create.mock.calls[0][0] as {
      email: string;
      fullName: string;
      passwordHash: string;
    };
    expect(arg.email).toBe('minh@example.com');
    expect(arg.fullName).toBe('Minh');
    expect(arg.passwordHash).not.toBe(dto.password);
    expect(arg.passwordHash.startsWith('$argon2id$')).toBe(true);
    await expect(argon2.verify(arg.passwordHash, dto.password)).resolves.toBe(
      true,
    );
  });

  it('rejects an email that is already registered', async () => {
    users.findByEmail.mockResolvedValue({ id: 'u1' });

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(users.create).not.toHaveBeenCalled();
  });

  it('maps a unique-constraint race (P2002) to a conflict', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('does not hide unexpected database errors', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockRejectedValue(new Error('connection lost'));

    await expect(service.register(dto)).rejects.toThrow('connection lost');
  });
});

describe('RegisterDto', () => {
  it('trims and lowercases the email, and trims the name', async () => {
    const instance = plainToInstance(RegisterDto, {
      email: '  Minh@Example.COM ',
      password: 'matkhau123',
      fullName: '  Minh  ',
    });

    expect(await validate(instance)).toHaveLength(0);
    expect(instance.email).toBe('minh@example.com');
    expect(instance.fullName).toBe('Minh');
  });

  it('rejects a short password and an invalid email', async () => {
    const instance = plainToInstance(RegisterDto, {
      email: 'abc',
      password: '123',
      fullName: 'Minh',
    });

    const errors = await validate(instance);
    const fields = errors.map((e) => e.property).sort();
    expect(fields).toEqual(['email', 'password']);
  });
});
