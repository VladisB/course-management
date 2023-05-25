import { Module } from "@nestjs/common";
import { HomeWorksService } from "./homeworks.service";
import { HomeWorksController } from "./homeworks.controller";
import { HomeworksRepository, IHomeworksRepository } from "./homeworks.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Homework } from "./entities/homework.entity";
import { HomeworkViewModelFactory } from "./model-factories";
import { LessonsModule } from "src/lessons/lessons.module";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Homework]), LessonsModule, UsersModule],
    controllers: [HomeWorksController],
    providers: [
        HomeWorksService,
        HomeworkViewModelFactory,
        {
            useClass: HomeworksRepository,
            provide: IHomeworksRepository,
        },
    ],
})
export class HomeWorksModule {}
