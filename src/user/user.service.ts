import { HttpException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from './entities/user.entity'; // Importing the User entity
import { Repository } from 'typeorm'; // TypeORM repository to interact with the database
import { InjectRepository } from '@nestjs/typeorm'; // Injects TypeORM repository
import * as argon2 from 'argon2'; // Library for password hashing
import { JwtService } from '@nestjs/jwt'; // Service for handling JWT
import { LoginDto } from 'src/user/dto/LoginDto.dto'; // DTO for login
import { Response, Request } from 'express'; // Express request and response objects

@Injectable()
export class UserService {
  // Injecting the User repository and JWT service in the constructor
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>, 
    private jwtService: JwtService
  ) {}

  // Method to create a new user
  async create(payload: CreateUserDto) {
    const { email, password, ...rest } = payload;
    
    // Check if user with email already exists
    const existingUser = await this.userRepo.findOne({ where: { email: email } });
    if (existingUser) {
      throw new HttpException("Sorry, user with this email already exists", 400);
    }

    // Hash the user's password
    const hashedPassword = await argon2.hash(password);

    // Save new user in the database
    const userDetails = await this.userRepo.save({
      email,
      password: hashedPassword,
      ...rest,
    });

    // Remove password from the user object before returning
    delete userDetails.password;
    
    // Create JWT token payload
    const userPayload = { id: userDetails.id, email: userDetails.email };

    // Return access token
    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }

  // Method to find a user by email
  async findEmail(email: string) {
    const mail = await this.userRepo.findOneByOrFail({ email });
    if (!mail) {
      throw new UnauthorizedException();
    }

    return mail;
  }

  // Method for signing in the user
  async signIn(payload: LoginDto, @Req() req: Request, @Res() res: Response) {
    const { email, password } = payload;

    // Find user by email
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new HttpException("No email found", 400);
    }

    // Verify the password
    const passwordIsValid = await this.verifyPassword(user.password, password);
    if (!passwordIsValid) {
      throw new HttpException("Sorry, password doesn't match", 400);
    }

    // Create JWT token
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
    });

    // Set authentication token as a cookie
    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    // Return the token
    return res.send({
      success: true,
      userToken: token,
    });
  }

  // Method for logging out the user
  async logout(@Req() req: Request, @Res() res: Response) {
    // Clear authentication cookie
    const clearCookie = res.clearCookie('isAuthenticated');
    const response = res.send('User successfully logged out');
    
    return {
      clearCookie,
      response,
    };
  }

  // Method to verify if a provided password matches the hashed password
  async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      return false;
    }
  }

  // Method to retrieve user details based on JWT authorization header
  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader) {
      // Extract the token from the Bearer authorization header
      const token = authorizationHeader.replace('Bearer ', '');
      const secret = process.env.JWTSECRET;

      try {
        // Verify the JWT token
        const decoded = await this.jwtService.verifyAsync(token);
        const id = decoded['id'];

        // Find the user by ID
        const user = await this.userRepo.findOneBy({ id });
        return { id: id, name: user.name, email: user.email, role: user.role };
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Invalid or missing Bearer token');
    }
  }

  // Method to retrieve all users (can be expanded later)
  findAll() {
    return `This action returns all users`;
  }

  // Commented-out methods that can be implemented later
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
