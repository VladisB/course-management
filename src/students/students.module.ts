import { Module } from "@nestjs/common";
import { IStudentsService, StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { UsersModule } from "@app/users/users.module";
import { RolesModule } from "@app/roles/roles.module";
import { StudentsViewModelFactory } from "./model-factories";
import { CoursesModule } from "@app/courses/courses.module";

@Module({
    imports: [UsersModule, RolesModule, CoursesModule],
    controllers: [StudentsController],
    providers: [
        StudentsViewModelFactory,
        {
            provide: IStudentsService,
            useClass: StudentsService,
        },
    ],
})
export class StudentsModule {}
