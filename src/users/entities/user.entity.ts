import * as bcrypt from "bcryptjs";
import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsEmail } from "class-validator";
import { Role } from "@app/roles/entities/role.entity";
import { Group } from "@app/groups/entities/group.entity";
import { StudentCourses } from "@app/student-courses/entities/student-courses.entity";
import { LessonGrades } from "@app/lesson-grades/entities/lesson-grade.entity";
import { Homework } from "@app/homeworks/entities/homework.entity";
import { CourseInstructors } from "@app/course-instructors/entities/course-instructors.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ nullable: true, name: "refresh_token" })
    refreshToken: string;

    @Column({ nullable: false })
    salt: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: "role_id" })
    role: Role;

    @ManyToOne(() => Group, (group) => group.users, { eager: true })
    @JoinColumn({ name: "group_id" })
    group: Group;

    @OneToMany(() => LessonGrades, (lessonGrade) => lessonGrade.student)
    myGrades: LessonGrades[];

    @OneToMany(() => Homework, (homeWork) => homeWork.student)
    myHomeworks: Homework[];

    @OneToMany(() => CourseInstructors, (courseInstructors) => courseInstructors.instructor)
    courseInstructors: CourseInstructors[];

    @OneToMany(() => StudentCourses, (studentCourses) => studentCourses.student)
    studentCourses: StudentCourses[];

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "created_by" })
    public createdBy: User;

    @ManyToOne(() => User, { nullable: true })
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

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    async validateRawPassword(rawPassword: string): Promise<boolean> {
        return rawPassword === this.password;
    }

    @BeforeInsert()
    async setPassword() {
        if (this.password) {
            this.salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, this.salt);
        }
    }

    @BeforeInsert()
    nameToUpperCase() {
        this.email = this.email.toLowerCase();
    }
}
