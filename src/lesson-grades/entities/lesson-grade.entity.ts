import { Lesson } from "src/lessons/entities/lesson.entity";
import { User } from "src/users/entities/user.entity";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Index(["student", "lesson"], { unique: true })
@Entity()
export class LessonGrades extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Lesson, (lesson) => lesson.grades)
    @JoinColumn({ name: "lesson_id" })
    public lesson: Lesson;

    @ManyToOne(() => User, (user) => user.myGrades)
    @JoinColumn({ name: "student_id" })
    public student: User;

    // Instructor who created the grade
    @ManyToOne(() => User, (user) => user.createdGrades)
    @JoinColumn({ name: "created_by" })
    public createdBy: User;

    @Column({ type: "integer", nullable: false })
    grade: number;

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
