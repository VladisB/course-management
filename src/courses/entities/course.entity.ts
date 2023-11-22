import { GroupCourses } from "@app/groups/entities/group-courses.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { CourseInstructors } from "@app/course-instructors/entities/course-instructors.entity";

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
