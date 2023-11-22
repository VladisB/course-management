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
import { Faculty } from "../../faculties/entities/faculty.entity";
import { User } from "../../users/entities/user.entity";
import { GroupCourses } from "./group-courses.entity";

@Entity()
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Faculty, (faculty) => faculty.groups, { eager: true })
    @JoinColumn({ name: "faculty_id" })
    faculty: Faculty;

    @OneToMany(() => User, (user) => user.group)
    users: User[];

    @OneToMany(() => GroupCourses, (groupCourses) => groupCourses.group)
    groupCourses: GroupCourses[];

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
        name: "modified_at",
    })
    public modifiedAt: Date;
}
