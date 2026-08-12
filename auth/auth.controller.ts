import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator'; // <-- Import the Public decorator

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // <-- ADD THIS: Allows access without a JWT token
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public() // <-- ADD THIS: Allows refreshing tokens without a valid JWT
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: { token: string }) {
    return this.authService.refresh(dto.token);
  }
}
