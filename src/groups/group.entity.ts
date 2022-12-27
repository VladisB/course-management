import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Faculty } from "../faculties/faculty.entity";
import { User } from "../users/user.entity";

@Entity()
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Faculty, (faculty) => faculty.groups, { eager: true })
    faculty: Faculty;

    @Column({ nullable: false })
    facultyId: number;

    @OneToMany(() => User, (user) => user.group)
    users: User[];
}
