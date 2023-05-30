import { Module } from "@nestjs/common";
import { HomeWorksService } from "./homeworks.service";
import { HomeWorksController } from "./homeworks.controller";
import { HomeworksRepository, IHomeworksRepository } from "./homeworks.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Homework } from "./entities/homework.entity";
import { HomeworkViewModelFactory } from "./model-factories";
import { LessonsModule } from "src/lessons/lessons.module";
import { UsersModule } from "src/users/users.module";
import { FilesModule } from "src/files/files.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        TypeOrmModule.forFeature([Homework]),
        LessonsModule,
        UsersModule,
        FilesModule,
        ConfigModule,
        ThrottlerModule.forRootAsync({
            useFactory: (config: ConfigService) => {
                return {
                    ttl: config.getOrThrow("app.uploadRateLimitTTL"),
                    limit: config.getOrThrow("app.uploadRateLimit"),
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [HomeWorksController],
    providers: [
        HomeWorksService,
        HomeworkViewModelFactory,
        {
            useClass: HomeworksRepository,
            provide: IHomeworksRepository,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class HomeWorksModule {}
