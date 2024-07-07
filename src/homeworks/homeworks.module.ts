import { ConfigModule, ConfigService } from "@nestjs/config";
import { FilesModule } from "@app/files/files.module";
import { Homework } from "./entities/homework.entity";
import { HomeworkViewModelFactory } from "./model-factories";
import { HomeworksController } from "./homeworks.controller";
import { HomeworksRepository, IHomeworksRepository } from "./homeworks.repository";
import { HomeworksService } from "./homeworks.service";
import { LessonsModule } from "@app/lessons/lessons.module";
import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@app/users/users.module";

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
    controllers: [HomeworksController],
    providers: [
        HomeworksService,
        HomeworkViewModelFactory,
        {
            useClass: HomeworksRepository,
            provide: IHomeworksRepository,
        },
    ],
})
export class HomeWorksModule {}
