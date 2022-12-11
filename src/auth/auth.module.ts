import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.stratagy";

@Module({
  imports: [
    //TODO: Create enums for stratagies
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: "someSecret22",
      signOptions: {
        expiresIn: 3600,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
