import { User } from "@app/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    public createdBy: User;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "modified_by" })
    public modifiedBy: User;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        name: "created_at",
        nullable: false,
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
        name: "modified_at",
        nullable: false,
    })
    public modifiedAt: Date;
}
