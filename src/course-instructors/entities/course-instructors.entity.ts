import { Course } from "@app/courses/entities/course.entity";
import { User } from "@app/users/entities/user.entity";
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

@Index(["courseId", "instructorId"], { unique: true })
@Entity()
export class CourseInstructors {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public courseId: number;

    @Column()
    public instructorId: number;

    @ManyToOne(() => Course, (course) => course.courseInstructors)
    public course: Course;

    @ManyToOne(() => User, (user) => user.courseInstructors)
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
