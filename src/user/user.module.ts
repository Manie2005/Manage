import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from 'src/jwt-strategy/jwt-strategy';

dotenv.config();

@Module({
  imports: [
    // Import TypeORM module and register the User entity for database operations
    TypeOrmModule.forFeature([User]), 
    
    // Register JWT module globally and configure the secret and expiration time for tokens
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Ensure the JWT_SECRET is set in your environment variables
      signOptions: { expiresIn: '1h' }, // Set token expiration time to 1 hour
    }),

    // Register Passport module with JWT as the default strategy
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false, // Disable session support for token-based authentication
    }),
  ],
  
  controllers: [UserController], // Register the UserController
  
  providers: [
    UserService, // Register the UserService as a provider
    JWTStrategy, // Register the custom JWT strategy
    PassportModule, // PassportModule is registered as a provider for dependency injection
  ],
  
  exports: [
    JWTStrategy, // Export JWTStrategy for use in other modules
    PassportModule, // Export PassportModule for use in other modules
    UserService, // Export UserService for use in other modules
  ],
})
export class UserModule {}
