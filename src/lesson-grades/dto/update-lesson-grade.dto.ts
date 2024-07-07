import { PartialType } from "@nestjs/swagger";
import { CreateLessonGradeDto } from "./create-lesson-grade.dto";

export class UpdateLessonGradeDto extends PartialType(CreateLessonGradeDto) {}
