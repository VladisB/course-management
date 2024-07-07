import { SelectQueryBuilder } from "typeorm";

function mockQueryBuilder<T>(mockEntityList: any[]): Partial<SelectQueryBuilder<T>> {
    return {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockEntityList, mockEntityList.length]),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
    };
}

export { mockQueryBuilder };
