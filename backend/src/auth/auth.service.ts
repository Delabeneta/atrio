// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';

// Usuários fixos
const USERS = {
  admin: {
    password: '1234',
    role: 'admin',
    name: 'Administrador',
  },
  membro: {
    password: '1234',
    role: 'member',
    name: 'Membro',
  },
};

@Injectable()
export class AuthService {
  // Remove o async se não tem await
  login(username: string, password: string, role: string) {
    const user = USERS[username.toLowerCase()];

    if (!user || user.password !== password) {
      return {
        success: false,
        message: 'Usuário ou senha inválidos',
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
        name: user.name,
        username: username.toLowerCase(),
        role: user.role,
      },
      token: `token-${Date.now()}`,
    };
  }
}
