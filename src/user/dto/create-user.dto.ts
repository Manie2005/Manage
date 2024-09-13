import { IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength, IsString } from "class-validator"; // Import validators from class-validator
import { Role } from '../../enum/role.enum'; // Import Role enum

// Data Transfer Object (DTO) for creating a user
export class CreateUserDto {

    // The user's name is required and must be a string
    @IsNotEmpty()
    @IsString()
    name: string;

    // The user's email is required and must be a valid email address
    @IsNotEmpty()
    @IsEmail()
    email: string;

    // The user's password is required, must be between 8 and 16 characters, and must include
    // at least one uppercase letter, one number, and one special character
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(16, { message: 'Password must not be more than 16 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character'
    })
    password: string;

    // The user's role is optional and should be of type Role if provided
    @IsOptional()
    role: Role;
}
