import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { JwtModel } from "../models";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
    constructor(private authService: AuthService, private readonly configService: ConfigService) {
        super({
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>("app.jwt"),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const token = request?.cookies["refreshToken"];
                    if (!token) {
                        return null;
                    }
                    return token;
                },
            ]),
        });
    }

    async validate(req: Request, payload: JwtModel): Promise<User> {
        const refreshToken = req?.cookies["refreshToken"];

        if (!refreshToken) {
            throw new BadRequestException("invalid refresh token");
        }

        return await this.authService.validateRefreshToken(payload, refreshToken);
    }
}
