import * as bcrypt from "bcryptjs";
import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import { Role } from "../roles/role.entity";
import { Group } from "../groups/group.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ nullable: true, name: "refresh_token" })
    refreshToken: string;

    @Column({ nullable: false })
    salt: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    role: Role;

    @Column({ nullable: false, name: "role_id" })
    roleId: number;

    @ManyToOne(() => Group, (group) => group.users, { eager: true })
    group: Group;

    @Column({ nullable: true, name: "group_id" })
    groupId: number;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        name: "created_at",
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
        name: "updated_at",
    })
    public updatedAt: Date;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    @BeforeInsert()
    // @BeforeUpdate()
    // TODO: Update logic to run it on update ONLY if password field changed
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
