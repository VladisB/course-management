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
import { Group } from "@app/groups/entities/group.entity";
import { User } from "@app/users/entities/user.entity";

@Entity()
export class Faculty extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Group, (group) => group.faculty)
    groups: Group[];

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    public createdBy: User;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        name: "created_at",
    })
    public createdAt: Date;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "modified_by" })
    public modifiedBy: User;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
        name: "modifiedAt",
    })
    public modifiedAt: Date;
}
