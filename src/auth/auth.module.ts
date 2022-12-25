import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModelFactory } from "./model-factories";
import { RefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
    imports: [
        ConfigModule,
        //TODO: Create enums for stratagies
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>("app.jwt"),
                    signOptions: {
                        expiresIn: "15m",
                    },
                };
            },
            inject: [ConfigService],
        }),
        forwardRef(() => UsersModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshStrategy, JwtModelFactory, ConfigService],
    exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
