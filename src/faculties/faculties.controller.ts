import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../roles/roles.enum";
import { Roles } from "../roles/roles-auth.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CreateFacultyDto } from "./dto/create-faculty.dto";
import { FacultiesService } from "./faculties.service";

@Roles(Role.Admin)
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
    getFaculties() {
        return this.facultyService.getFaculties();
    }
}
