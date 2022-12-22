import * as bcrypt from "bcryptjs";
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
import { Role } from "../roles/role.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: false })
    salt: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    role: Role;

    @Column({ nullable: false })
    roleId: number;

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
