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
    JoinColumn,
} from "typeorm";

@Index(["courseId", "studentId"], { unique: true })
@Entity()
export class StudentCourses {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public courseId: number;

    @Column()
    public studentId: number;

    // Avarage by lessons
    @Column({ nullable: true, default: null, name: "final_mark", type: "float" })
    public finalMark: number;

    @Column({ nullable: true, default: null, name: "feedback" })
    public feedback: string;

    @Column({ nullable: false, default: false })
    public passed: boolean;

    @ManyToOne(() => Course, (course) => course.studentCourses)
    public course: Course;

    @ManyToOne(() => User, (user) => user.courseInstructors)
    public student: User;

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
