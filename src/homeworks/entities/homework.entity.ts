import { Lesson } from "@app/lessons/entities/lesson.entity";
import { User } from "@app/users/entities/user.entity";
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
export class Homework extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Lesson, (lesson) => lesson.homeworks, { nullable: false })
    @JoinColumn({ name: "lesson_id" })
    public lesson: Lesson;

    @ManyToOne(() => User, (user) => user.myHomeworks, { nullable: false })
    @JoinColumn({ name: "student_id" })
    public student: User;

    @Column({ name: "file_path", nullable: false })
    public filePath: string;

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
        nullable: false,
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
        name: "modified_at",
        nullable: false,
    })
    public modifiedAt: Date;
}
