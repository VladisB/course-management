import { Course } from "src/courses/entities/course.entity";
import { Homework } from "src/homeworks/entities/homework.entity";
import { LessonGrades } from "src/lesson-grades/entities/lesson-grade.entity";
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

    @ManyToOne(() => Course, (course) => course.groupCourses)
    @JoinColumn({ name: "course_id" })
    public course: Course;

    @OneToMany(() => LessonGrades, (LessonGrade) => LessonGrade.lesson)
    public grades: LessonGrades[];

    @OneToMany(() => Homework, (Homework) => Homework.lesson)
    public homeworks: Homework[];

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
