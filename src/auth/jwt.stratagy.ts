import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./types";
import { User } from "src/users/user.entity";
import { AuthService } from "./auth.service";

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
