import { GroupCourses } from "src/groups/entities/group-to-course.entity";
import { User } from "src/users/entities/user.entity";
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
import { CourseInstructors } from "./course-to-instructor.entity";

@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public name: string;

    @Column({ default: false })
    public available: boolean;

    @OneToMany(() => GroupCourses, (groupCourses) => groupCourses.course)
    public groupCourses: GroupCourses[];

    @OneToMany(() => GroupCourses, (courseInstructors) => courseInstructors.course)
    public courseInstructors: CourseInstructors[];

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "instructor_id" })
    public instructor: User;

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
