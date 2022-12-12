// import {
//   BelongsToMany,
//   Column,
//   DataType,
//   Model,
//   Table,
// } from 'sequelize-typescript';
// import { User } from '../users/users.model';
// import { UserRoles } from './user-roles.model';

// interface RoleCreationAttrs {
//   value: string;
//   description: string;
// }

// @Table({ tableName: 'roles' })
// export class Role extends Model<Role, RoleCreationAttrs> {
//   @Column({
//     type: DataType.INTEGER,
//     unique: true,
//     autoIncrement: true,
//     primaryKey: true,
//   })
//   id: number;

//   @Column({ type: DataType.STRING, unique: true, allowNull: false })
//   value: string;

//   @Column({ type: DataType.STRING, allowNull: false })
//   description: string;

//   @BelongsToMany(() => User, () => UserRoles)
//   users: User[];
// }

import { User } from "src/users/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
