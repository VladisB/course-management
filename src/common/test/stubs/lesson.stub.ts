import { Lesson } from "@app/lessons/entities/lesson.entity";
import { courseStub } from "@app/common/test/stubs/course.stub";
import { LessonViewModel } from "@app/lessons/view-models";
import { Course } from "@app/courses/entities/course.entity";

let lessonMockList: Lesson[] = [];

const lessonStub = new Lesson();
lessonStub.id = 1;
lessonStub.course = courseStub;
lessonStub.theme = "Test theme";
lessonStub.date = new Date();

const courseStubCS = new Course();
courseStubCS.id = 13;
courseStubCS.name = "Computer Science";
courseStubCS.available = true;

const lessonStubCS = new Lesson();
lessonStubCS.id = 1;
lessonStubCS.course = courseStubCS;
lessonStubCS.theme = "Computer Science. theme 2";
lessonStubCS.date = new Date();

lessonMockList = [lessonStub];

const lessonVMStub = new LessonViewModel();
lessonVMStub.id = 1;
lessonVMStub.course = courseStub.name;
lessonVMStub.theme = "Test theme";
lessonVMStub.date = new Date();
lessonVMStub.courseId = 1;

const lessonVMMockList: LessonViewModel[] = [lessonVMStub];

export { lessonMockList, lessonStub, lessonVMMockList, lessonStubCS };
