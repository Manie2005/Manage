import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service'; // Adjust import path if necessary
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { User } from 'src/user/entities/user.entity'; // Adjust import path if necessary

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService // Inject ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'), // Use ConfigService to get the secret
        });
    }

    async validate(payload: { email: string }): Promise<User> {
        const user = await this.userService.findEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint');
        }
        return user;
    }
}
