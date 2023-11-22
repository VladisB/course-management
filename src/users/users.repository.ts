import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, QueryRunner, Repository, SelectQueryBuilder } from "typeorm";
import { User } from "./entities/user.entity";
import { BaseRepository, IBaseRepository } from "@common/db/base.repository";
import { BaseErrorMessage, RoleName } from "@common/enum";

@Injectable()
export class UsersRepository extends BaseRepository implements IUsersRepository {
    private readonly tableName = "user";

    constructor(
        @InjectRepository(User)
        private readonly entityRepository: Repository<User>,
    ) {
        super(entityRepository.manager.connection.createQueryRunner());
    }

    public async getByEmail(email: string): Promise<User> {
        return await this.entityRepository.findOne({
            where: {
                email,
            },
        });
    }

    public async getById(id: number): Promise<User> {
        if (!id) return null;

        return await this.entityRepository.findOne({
            where: {
                id,
            },
            relations: {
                role: true,
                group: true,
                studentCourses: true,
            },
        });
    }

    public async trxGetById(queryRunner: QueryRunner, id: number): Promise<User> {
        return await queryRunner.manager.findOne(User, {
            where: {
                id,
            },
            relations: {
                role: true,
                group: true,
                studentCourses: true,
            },
        });
    }

    public async getStudentById(id: number): Promise<User> {
        if (!id) return null;

        return await this.entityRepository.findOne({
            where: {
                id,
                role: { name: RoleName.Student },
            },
            relations: ["role", "group", "studentCourses", "studentCourses.course"],
        });
    }

    public async getByIdList(idList: number[], roleId: number): Promise<User[]> {
        return await this.entityRepository.find({
            where: {
                id: In(idList),
                role: { id: roleId },
            },
            relations: {
                role: true,
            },
        });
    }

    public getAllQ(): SelectQueryBuilder<User> {
        const userQuery = this.entityRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.group", "group");

        return userQuery;
    }

    public getAllStudentsQ(): SelectQueryBuilder<User> {
        const userQuery = this.entityRepository
            .createQueryBuilder(this.tableName)
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.group", "group")
            .leftJoinAndSelect("user.studentCourses", "studentCourses")
            .leftJoinAndSelect("studentCourses.course", "course")
            .where("role.name = :roleName", { roleName: RoleName.Student });

        return userQuery;
    }

    public async create(entity: User): Promise<User> {
        const { id } = await this.entityRepository.save(entity);

        return await this.getById(id);
    }

    public async trxCreate(queryRunner: QueryRunner, entity: User): Promise<User> {
        try {
            const { id } = await queryRunner.manager.save(entity);

            return await this.trxGetById(queryRunner, id);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async update(entity: User): Promise<User> {
        try {
            const { id: entityId } = await this.entityRepository.save(entity);

            return await this.getById(entityId);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async trxUpdate(queryRunner: QueryRunner, entity: User): Promise<User> {
        try {
            const { id: entityId } = await queryRunner.manager.save(entity);

            return await this.trxGetById(queryRunner, entityId);
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async deleteById(id: number): Promise<void> {
        await this.entityRepository.delete(id);

        return;
    }

    public async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
        // NOTE: update() does not trigger the @beforeUpdate() hook
        try {
            await this.entityRepository.update({ id }, { refreshToken });
        } catch (err) {
            console.error("Error: ", err);

            throw new Error(BaseErrorMessage.DB_ERROR);
        }
    }

    public async getStudentCoursesByStudentId(studentId: number): Promise<User> {
        return await this.entityRepository.findOne({
            where: {
                id: studentId,
            },
            relations: {
                studentCourses: true,
            },
        });
    }

    public async getInstructorCourses(instructorId: number): Promise<User> {
        return await this.entityRepository.findOne({
            where: {
                id: instructorId,
            },
            relations: {
                courseInstructors: true,
            },
        });
    }
}

export abstract class IUsersRepository extends IBaseRepository {
    abstract create(entity: User): Promise<User>;
    abstract trxCreate(queryRunner: QueryRunner, entity: User): Promise<User>;
    abstract deleteById(id: number): Promise<void>;
    abstract getAllQ(): SelectQueryBuilder<User>;
    abstract getAllStudentsQ(): SelectQueryBuilder<User>;
    abstract getByEmail(email: string): Promise<User>;
    abstract getById(id: number, roleName?: RoleName): Promise<User>;
    abstract trxGetById(queryRunner: QueryRunner, id: number): Promise<User>;
    abstract getStudentById(id: number): Promise<User>;
    abstract getByIdList(idList: number[], roleId: number): Promise<User[]>;
    abstract trxUpdate(queryRunner: QueryRunner, entity: User): Promise<User>;
    abstract update(entity: User): Promise<User>;
    abstract updateRefreshToken(id: number, refreshToken: string | null): Promise<void>;
    abstract getStudentCoursesByStudentId(studentId: number): Promise<User>;
    abstract getInstructorCourses(instructorId: number): Promise<User>;
}
