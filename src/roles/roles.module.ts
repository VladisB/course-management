import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { User } from 'src/users/users.model';
import { UserRoles } from './user-roles.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Role, User, UserRoles]),
    forwardRef(() => AuthModule),
  ],
  exports: [RolesService],
})
export class RolesModule {}
