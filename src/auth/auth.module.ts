import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.stratagy";
import { JwtModelFactory } from "./model-factories";

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
    providers: [AuthService, JwtStrategy, JwtModelFactory],
    exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
