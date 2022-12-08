import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
// import { UserRoles } from './roles/user-roles.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    // SequelizeModule.forRoot({
    //   dialect: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: Number(process.env.POSTGRESS_PORT),
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRESS_PASSWORD,
    //   database: process.env.POSTGRES_DB,
    //   models: [User, Role, UserRoles],
    //   autoLoadModels: true,
    // }),
    UsersModule,
    // RolesModule,
    // AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
