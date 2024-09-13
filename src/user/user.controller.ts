import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service'; // Import the UserService to handle business logic
import { CreateUserDto } from 'src/user/dto/create-user.dto'; // DTO for creating a user
import { Request, Response } from 'express'; // Importing Request and Response from Express for handling HTTP requests
import { AuthGuard } from '@nestjs/passport'; // AuthGuard for JWT-based authentication
import { RolesGuard } from 'src/guard/role.guard'; // Custom guard to handle role-based access control
import { Roles } from 'src/guard/role'; // Decorator for defining roles
import { LoginDto } from 'src/user/dto/LoginDto.dto'; // DTO for user login

// Controller to handle user-related routes
@Controller('User') // Prefix all routes with `/User`
export class UserController {
  // Constructor to inject UserService
  constructor(private readonly userService: UserService) {}

  // POST /User/signup - Route for user signup
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    // Calls the UserService to create a new user
    return this.userService.create(createUserDto);
  }

  // POST /User/login - Route for user login
  @Post('login')
  login(@Body() payload: LoginDto, @Req() req: Request, @Res() res: Response) {
    // Calls the UserService to handle user login
    return this.userService.signIn(payload, req, res);
  }
  
  // POST /User/logout - Route for user logout
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    // Calls the UserService to handle user logout
    return this.userService.logout(req, res);
  }

  // GET /User - Route for fetching all users (restricted to admin role)
  @Get()
  @UseGuards(AuthGuard(), RolesGuard) // Applying guards for authentication and role-based access
  @Roles('admin') // Only accessible by users with 'admin' role
  findAll() {
    // Calls the UserService to get all users
    return this.userService.findAll();
  }

  // Uncomment these methods if needed for additional functionality:

  // GET /User/:id - Route for fetching a user by ID
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // PATCH /User/:id - Route for updating a user by ID
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // DELETE /User/:id - Route for deleting a user by ID
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
