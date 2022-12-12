// import {
//   BelongsToMany,
//   Column,
//   DataType,
//   Model,
//   Table,
// } from 'sequelize-typescript';
import { Role } from "src/roles/role.entity";
import * as bcrypt from "bcryptjs";
// import { UserRoles } from 'src/roles/user-roles.model';

// interface UserCreationAttrs {
//   email: string;
//   password: string;
// }

// @Table({ tableName: 'users' })
// export class User extends Model<User, UserCreationAttrs> {
//   @Column({
//     type: DataType.INTEGER,
//     unique: true,
//     autoIncrement: true,
//     primaryKey: true,
//   })
//   id: number;

//   @Column({ type: DataType.STRING, unique: true, allowNull: false })
//   email: string;

//   @Column({ type: DataType.STRING, allowNull: false })
//   password: string;

//   @Column({ type: DataType.STRING, allowNull: true })
//   refreshToken: string;

//   @BelongsToMany(() => Role, () => UserRoles)
//   roles: Role[];
// }

import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
// import * as bcrypt from "bcrypt";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: false })
  salt: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @Column({ nullable: false })
  roleId: number;

  // async validatePassword(password: string): Promise<boolean> {
  //     const hash = await bcrypt.hash(password, this.salt);
  //     return hash === this.password;
  // }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password) {
      this.salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, this.salt);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  nameToUpperCase() {
    this.email = this.email.toLowerCase();
  }
}
