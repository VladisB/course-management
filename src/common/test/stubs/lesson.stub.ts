import { Lesson } from "@app/lessons/entities/lesson.entity";
import { courseStub } from ".";
import { LessonViewModel } from "@app/lessons/view-models";

let lessonMockList: Lesson[] = [];

const lessonStub = new Lesson();
lessonStub.id = 1;
lessonStub.course = courseStub;
lessonStub.theme = "Test theme";
lessonStub.date = new Date();

lessonMockList = [lessonStub];

const lessonVMStub = new LessonViewModel();
lessonVMStub.id = 1;
lessonVMStub.course = courseStub.name;
lessonVMStub.theme = "Test theme";
lessonVMStub.date = new Date();
lessonVMStub.courseId = 1;

const lessonVMMockList: LessonViewModel[] = [lessonVMStub];

export { lessonMockList, lessonStub, lessonVMMockList };
