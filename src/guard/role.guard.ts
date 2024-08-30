import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ForbiddenRoleException } from "src/exception/role.exception";
import { UserService } from "src/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector, private userService:UserService){}

    async canActivate(context:ExecutionContext): Promise<boolean> {
        const roles= this.reflector.get<string[]>('roles',context.getHandler())
        const request=context.switchToHttp().getRequest()
        if(request?.user){
            const headers:Headers=request.headers;
            let user=this.userService.user(headers);
         //   if(!roles.includes((await user).role)){
           //     throw new ForbiddenRoleException(roles.join(' or '))
            //}
        return true;
        }
        return false;
    }
}