import { PartialType } from "@nestjs/mapped-types";
import { CreateLessonGradeDto } from "./create-lesson-grade.dto";

export class UpdateLessonGradeDto extends PartialType(CreateLessonGradeDto) {}
