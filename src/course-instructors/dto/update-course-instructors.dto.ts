import { PartialType } from "@nestjs/mapped-types";
import { CreateCourseInstructorsDto } from "./create-course-instructors.dto";

export class UpdateCourseDto extends PartialType(CreateCourseInstructorsDto) {}
