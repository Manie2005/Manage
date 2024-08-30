import { HttpException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/loginDto.dto';
import { Response,Request } from 'express';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo:Repository<User>, private jwtService:JwtService){}
 async create(payload: CreateUserDto) {
    const {email,password,...rest}=payload
    const user=await this.userRepo.findOne({where:{email:email}})
    if(user){
      throw new HttpException("Sorry, user with this email already exists",400)
    }
    const hashedPassword = await argon2.hash(password)
    const userDetails=await this.userRepo.save({
      email,
      password:hashedPassword,
      ...rest
    })
    // const getUser=this.userRepo.findOne({where:{email:email},relations:{todo:true}})
    delete userDetails.password;
    const userpayload={id:userDetails.id,email:userDetails.email}
    return{
      access_token:await this.jwtService.signAsync(userpayload)
    }
  }

  async findEmail(email:string){
    const mail=await this.userRepo.findOneByOrFail({email})
    if(!mail){
      throw new UnauthorizedException();
    }
    return mail;
  }
  // signin the user 
  async signIn(payload:LoginDto, @Req()req:Request,@Res() res:Response){
    const {email,password}=payload
    const user=await this.userRepo.findOneBy({email})
    if(!user){
      throw new HttpException("no email found",400)
    }

    const checkedPassword = await this.verifyPassword(user.password,password)
    if(!checkedPassword){
      throw new HttpException("sorry password doesn't exist ",400)
    }
    const token= await this.jwtService.signAsync({
      email:user.email,
      id:user.id
    })

    res.cookie('isAuthenticated',token,{
      httpOnly:true,
      maxAge:1*60*60*1000
    })
    
    return res.send({
      success:true,
      userToken:token
    })
  }
  // logout the user 
  async logout(@Req()req:Request, @Res()res:Response){
    const clearCookie=res.clearCookie('isAuthenticated');
    const response=res.send('user successfully logout');
    return {
      clearCookie,
      response
    }
  }

  async verifyPassword(
    hashedPassword:string,
    plainPassword:string,
  ):Promise<boolean>{
    try{
      return await argon2.verify(hashedPassword,plainPassword);
    }
    catch(err){
      return false;
    }
  }

  async user(headers:any):Promise<any>{//you can use headers:any or headers:Request['headers'] in your parameter, it still returns type HTTP header, only that the latter will enable headers.authorization to be suggested by vscode
    const authorizationHeader= headers.authorization;
    if(authorizationHeader){
      const token= authorizationHeader.replace('Bearer ','')
      const secret=process.env.JWTSECRET;
      try{
        const decoded=this.jwtService.verifyAsync(token);
        let id=decoded['id'];
        let user=await this.userRepo.findOneBy({id})
        return { id:id, name:user.name,email:user.email,role:user.role}

      }
      catch(error){
        throw new UnauthorizedException('Invalid token')
      }
      

    }
    else{
      throw new UnauthorizedException('Invalid or missing Bearer token')
    }
  }

  
  
  findAll() {
    return `This action returns all user`;
  }

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

