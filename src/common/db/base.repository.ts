import { Injectable } from "@nestjs/common";
import { QueryRunner } from "typeorm";

@Injectable()
export class BaseRepository {
    public queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    async commitTrx(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.commitTransaction();
    }

    async rollbackTrx(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.rollbackTransaction();
    }

    public async initTrx(): Promise<QueryRunner> {
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        return this.queryRunner;
    }
}
