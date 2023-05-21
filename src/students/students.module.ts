import { Module } from "@nestjs/common";
import { IStudentsService, StudentsService } from "./students.service";
import { StudentsController } from "./students.controller";
import { UsersModule } from "src/users/users.module";
import { RolesModule } from "src/roles/roles.module";
import { StudentsViewModelFactory } from "./model-factories";
import { CoursesModule } from "src/courses/courses.module";

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
