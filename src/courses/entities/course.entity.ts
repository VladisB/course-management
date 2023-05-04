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
import { StudentCourses } from "src/student-courses/entities/student-courses.entity";

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

    @OneToMany(() => CourseInstructors, (courseInstructors) => courseInstructors.course)
    public courseInstructors: CourseInstructors[];

    @OneToMany(() => StudentCourses, (studentCourses) => studentCourses.course)
    public studentCourses: StudentCourses[];

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
