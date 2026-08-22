import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { usernameOuEmail: string; password: string }) {
    const result = await this.authService.login(
      body.usernameOuEmail,
      body.password,
    );

    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }

    return result;
  }

  @Post('logout')
  async logout(@Body() body: { token: string }) {
    return this.authService.logout(body.token);
  }
}
