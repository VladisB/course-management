import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleName } from "../roles/roles.enum";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesService } from "./faculties.service";

@Roles(RoleName.Admin)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("faculties")
export class FacultiesController {
    constructor(private facultyService: FacultiesService) {}

    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() dto: CreateFacultyDto) {
        return this.facultyService.createFaculty(dto);
    }

    @Get()
    findAll() {
        return this.facultyService.getFaculties();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        throw new Error("Not implemented");
    }

    @Patch(":id")
    update(@Param("id") id: number, @Body() updateFacultyDto: any) {
        throw new Error("Method not implemented");
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        throw new Error("Method not implemented");
    }
}
