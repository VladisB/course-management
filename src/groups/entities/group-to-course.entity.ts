import { Course } from "@app/courses/entities/course.entity";
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";
import { Group } from "./group.entity";

@Index(["courseId", "groupId"], { unique: true })
@Entity()
export class GroupCourses {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public courseId: number;

    @Column()
    public groupId: number;

    @ManyToOne(() => Course, (course) => course.groupCourses)
    public course: Course;

    @ManyToOne(() => Group, (group) => group.groupCourses)
    public group: Group;

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
