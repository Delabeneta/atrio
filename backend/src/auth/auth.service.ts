import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(username: string, password: string, role: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        return {
          success: false,
          message: 'Usuário inválido',
        };
      }

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        return {
          success: false,
          message: 'Senha inválida',
        };
      }

      if (user.role !== role) {
        return {
          success: false,
          message: `Acesso negado. Você não tem permissão como ${role}.`,
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
        token: `token-${Date.now()}-${user.id}`,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro interno no servidor',
      };
    }
  }

  async validateToken(token: string) {
    // Implementar validação JWT depois
    return { valid: true };
  }
}
