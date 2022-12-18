import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./types";
import { AuthService } from "./auth.service";
import { User } from "../users/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "someSecret22",
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.authService.validateJwtUser(payload);

        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }

        return user;
    }
}
