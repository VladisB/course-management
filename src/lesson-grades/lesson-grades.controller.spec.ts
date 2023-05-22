import { Test, TestingModule } from "@nestjs/testing";
import { LessonGradesController } from "./lesson-grades.controller";
import { LessonGradesService } from "./lesson-grades.service";

describe("LessonGradesController", () => {
    let controller: LessonGradesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LessonGradesController],
            providers: [LessonGradesService],
        }).compile();

        controller = module.get<LessonGradesController>(LessonGradesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
