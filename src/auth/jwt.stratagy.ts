import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserViewModel } from "../users/view-models";
import { JwtModel } from "./models";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "someSecret22",
        });
    }

    async validate(payload: JwtModel): Promise<UserViewModel> {
        const user = await this.authService.validateJwtUser(payload);

        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }

        return user;
    }
}
