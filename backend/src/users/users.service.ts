// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { getDefaultPasswordForRole } from 'src/auth/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (
      (createUserDto.role === 'COORDENADOR' ||
        createUserDto.role === 'LIDER') &&
      !createUserDto.organizationId
    ) {
      console.warn(
        `Usuário ${createUserDto.username} criado sem organização. Role: ${createUserDto.role}`,
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Username já está em uso');
    }

    const senhaPadrao = getDefaultPasswordForRole(
      createUserDto.role || 'LIDER',
    );
    const hashedPassword = await bcrypt.hash(senhaPadrao, 10);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username.toLowerCase(),
        password: hashedPassword,
        email: createUserDto.email,
        nome: createUserDto.nome,
        role: createUserDto.role as Role,
        organizationId: createUserDto.organizationId || null,
      },
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const usuarioAtual = await this.findOne(id);
    if (
      (updateUserDto.role === 'COORDENADOR' ||
        updateUserDto.role === 'LIDER') &&
      !updateUserDto.organizationId
    ) {
      throw new BadRequestException(
        `${updateUserDto.role} deve estar vinculado a uma organização`,
      );
    }

    const data: any = {};
    if (updateUserDto.nome) data.nome = updateUserDto.nome;
    if (updateUserDto.role) data.role = updateUserDto.role as Role;
    if (updateUserDto.username) {
      data.username = updateUserDto.username.toLowerCase();
    }
    if (updateUserDto.organizationId !== undefined) {
      data.organizationId = updateUserDto.organizationId || null;
    }

    if ((updateUserDto as any).resetPassword) {
      const roleParaSenha = updateUserDto.role || usuarioAtual.role;
      const senhaPadrao = getDefaultPasswordForRole(roleParaSenha);
      data.password = await bcrypt.hash(senhaPadrao, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async linkToOrganization(userId: string, organizationId: string) {
    const user = await this.findOne(userId);

    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      throw new BadRequestException(
        `${user.role} não precisa estar vinculado a uma organização`,
      );
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundException('Organização não encontrada');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { organizationId },
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        role: true,
        organizationId: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        nome: true,
        role: true,
      },
    });
  }
}
