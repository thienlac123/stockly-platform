import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { argon2id, hash } from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await hash(dto.password, { type: argon2id });

    try {
      return await this.users.create({
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
      });
    } catch (error) {
      // Hai yêu cầu đăng ký cùng email gửi gần như đồng thời: cả hai đều qua
      // bước kiểm tra ở trên, nhưng unique index của database chỉ cho một bên thắng.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }
}
