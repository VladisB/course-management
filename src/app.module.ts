import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/user.entity";
import { Role } from "./roles/role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    // RolesModule,
    // AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
