// import {
//   BelongsToMany,
//   Column,
//   DataType,
//   Model,
//   Table,
// } from 'sequelize-typescript';
import { Role } from 'src/roles/role.entity';
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

import { BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
// import * as bcrypt from "bcrypt";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;
    
    @Column()
    password: string;

    @Column()
    salt: string;

    @ManyToOne( () => Role, role => role.users, { eager: true })
    role: Role;

    // async validatePassword(password: string): Promise<boolean> {
    //     const hash = await bcrypt.hash(password, this.salt);
    //     return hash === this.password;
    // }
}