import { Course } from "@app/courses/entities/course.entity";
import { Homework } from "@app/homeworks/entities/homework.entity";
import { LessonGrades } from "@app/lesson-grades/entities/lesson-grade.entity";
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
export class Lesson extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public theme: string;

    @Column()
    public date: Date;

    @ManyToOne(() => Course, (course) => course.groupCourses, { nullable: false })
    @JoinColumn({ name: "course_id" })
    public course: Course;

    @OneToMany(() => LessonGrades, (LessonGrade) => LessonGrade.lesson)
    public grades: LessonGrades[];

    @OneToMany(() => Homework, (Homework) => Homework.lesson)
    public homeworks: Homework[];

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
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
        name: "modified_at",
    })
    public modifiedAt: Date;
}
