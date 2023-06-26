import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModelFactory } from "./model-factories";
import { RefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { Strategies } from "./strategies.enum";
import { UsersModule } from "@app/users/users.module";
import { UsersManagementModule } from "@app/users-management/users-management.module";

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: Strategies.JWT }),
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
        UsersModule,
        UsersManagementModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshStrategy, JwtModelFactory, ConfigService],
    exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
