import { IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength,IsString } from "class-validator";
import {Role} from '../enum/role.enum';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name:string;


    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(8, {message:'must be up to 8 characters'})
    @MaxLength(16, {message: 'password but not be more than 16 characters '})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,{message:
        'password must contain at least an uppercase, one number and one special key'
    })
    password:string;

    @IsOptional()
    role:Role
}