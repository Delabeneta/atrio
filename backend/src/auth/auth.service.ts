// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(usernameOuEmail: string, password: string) {
    try {
      console.log('Tentativa de login:');

      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ username: usernameOuEmail }, { email: usernameOuEmail }],
        },
      });

      console.log('  Usuário encontrado?', !!user);
      if (user) {
      }

      if (!user) {
        console.log(' Usuário não encontrado');
        return {
          success: false,
          message: 'Usuário inválido',
        };
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      console.log('  Senha válida?', passwordValid);

      if (!passwordValid) {
        console.log(' Senha inválida');
        return {
          success: false,
          message: 'Senha inválida',
        };
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

      await this.prisma.session.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });

      return {
        success: true,
        user: {
          id: user.id,
          nome: user.nome,
          username: user.username,
          role: user.role,
          organizationId: user.organizationId,
        },
        token,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro interno no servidor',
      };
    }
  }

  async logout(token: string) {
    await this.prisma.session.deleteMany({ where: { token } });
    return { success: true };
  }

  async validateToken(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      // Sessão expirada: limpa e recusa.
      await this.prisma.session
        .delete({ where: { id: session.id } })
        .catch(() => {
          // Se já foi removida por outra requisição concorrente, ignora.
        });
      return null;
    }

    return {
      id: session.user.id,
      nome: session.user.nome,
      username: session.user.username,
      role: session.user.role,
      organizationId: session.user.organizationId,
    };
  }
}
