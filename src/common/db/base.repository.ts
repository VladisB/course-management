import { Injectable } from "@nestjs/common";
import { QueryRunner } from "typeorm";

@Injectable()
export class BaseRepository implements IBaseRepository {
    private queryRunner: QueryRunner;

    constructor(private argQueryRunner: QueryRunner) {
        this.queryRunner = argQueryRunner;
    }

    public async commitTrx(argQueryRunner: QueryRunner): Promise<void> {
        await argQueryRunner.commitTransaction();
    }

    public async rollbackTrx(argQueryRunner: QueryRunner): Promise<void> {
        await argQueryRunner.rollbackTransaction();
    }

    public async initTrx(): Promise<QueryRunner> {
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        return this.queryRunner;
    }
}

export abstract class IBaseRepository {
    abstract commitTrx(argQueryRunner: QueryRunner): Promise<void>;
    abstract initTrx(): Promise<QueryRunner>;
    abstract rollbackTrx(argQueryRunner: QueryRunner): Promise<void>;
}
