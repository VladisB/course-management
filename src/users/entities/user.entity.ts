import * as bcrypt from "bcryptjs";
import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
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
import { Role } from "../../roles/entities/role.entity";
import { Group } from "../../groups/entities/group.entity";
import { CourseInstructors } from "src/courses/entities/course-to-instructor.entity";
import { StudentCourses } from "src/student-courses/entities/student-courses.entity";
import { LessonGrades } from "src/lesson-grades/entities/lesson-grade.entity";
import { Homework } from "src/homeworks/entities/homework.entity";

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
    @BeforeUpdate()
    nameToUpperCase() {
        this.email = this.email.toLowerCase();
    }
}
