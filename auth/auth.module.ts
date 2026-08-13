import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module'; // Needed if AuthService uses UsersService

@Module({
  imports: [
    PassportModule, // 1. Register Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mak-secret-key', // Must match jwt.strategy.ts
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule, // Ensure this is imported if AuthService depends on UsersService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 2. Provide the JwtStrategy here!
  exports: [AuthService],
})
export class AuthModule {}
