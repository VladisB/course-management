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

@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => GroupCourses, (groupCourses) => groupCourses.course)
    groupCourses: GroupCourses[];

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "instructor_id" })
    instructor: User;

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
