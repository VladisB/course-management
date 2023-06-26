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
import { GroupCourses } from "./group-to-course.entity";

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
}
