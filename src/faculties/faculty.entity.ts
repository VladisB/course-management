import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "../groups/group.entity";

@Entity()
export class Faculty extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Group, (group) => group.faculty)
    groups: Group[];
}
