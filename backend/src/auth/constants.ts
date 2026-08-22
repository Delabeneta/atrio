// src/auth/constants.ts

import 'dotenv/config';

const ROLE_DEFAULT_PASSWORDS: Record<string, string | undefined> = {
  ADMIN: process.env.ADMIN_PASSWORD,
  COORDENADOR: process.env.COORD_PASSWORD,
  LIDER: process.env.LIDER_PASSWORD,
};

export function getDefaultPasswordForRole(role: string): string {
  const senha = ROLE_DEFAULT_PASSWORDS[role];
  if (!senha) {
    throw new Error(
      `Senha padrão não configurada para o papel "${role}". ` +
        `Confira as variáveis ADMIN_PASSWORD / COORD_PASSWORD / LIDER_PASSWORD no .env.`,
    );
  }
  return senha;
}
export const DEFAULT_ROLE = 'LIDER';
