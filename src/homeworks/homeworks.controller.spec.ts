import { Test, TestingModule } from "@nestjs/testing";
import { HomeWorksController } from "./homeworks.controller";
import { HomeWorksService } from "./homeworks.service";

describe("HomeWorksController", () => {
    let controller: HomeWorksController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HomeWorksController],
            providers: [HomeWorksService],
        }).compile();

        controller = module.get<HomeWorksController>(HomeWorksController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
