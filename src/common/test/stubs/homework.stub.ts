import { lessonStub, studentRoleStub } from ".";
import { User } from "@app/users/entities/user.entity";
import { Homework } from "@app/homeworks/entities/homework.entity";
import { HomeworkViewModel } from "@app/homeworks/view-models";

const studentUserStub: User = new User();
studentUserStub.id = 2;
studentUserStub.email = "studentstub@gmail.com";
studentUserStub.firstName = "John Student";
studentUserStub.lastName = "Doe";
studentUserStub.role = studentRoleStub;
studentUserStub.group = null;

const homeworkStub = new Homework();
homeworkStub.id = 1;
homeworkStub.lesson = lessonStub;
homeworkStub.student = studentUserStub;
homeworkStub.filePath = "test path";
homeworkStub.createdBy = studentUserStub;
homeworkStub.modifiedBy = studentUserStub;
homeworkStub.createdAt = new Date();
homeworkStub.modifiedAt = new Date();

const homeworkMockList: Homework[] = [homeworkStub];

const homeworkViewModelStub = new HomeworkViewModel();
homeworkViewModelStub.id = homeworkStub.id;
homeworkViewModelStub.studentId = homeworkStub.student.id;
homeworkViewModelStub.studentName = homeworkStub.student.firstName;
homeworkViewModelStub.studentLastName = homeworkStub.student.lastName;
homeworkViewModelStub.downloadURL = homeworkStub.filePath;
homeworkViewModelStub.createdBy = homeworkStub.createdBy.email;
homeworkViewModelStub.modifiedBy = homeworkStub.modifiedBy.email;
homeworkViewModelStub.createdAt = homeworkStub.createdAt;
homeworkViewModelStub.modifiedAt = homeworkStub.modifiedAt;

const homeWorksVMMockList: HomeworkViewModel[] = [homeworkViewModelStub];

export { homeWorksVMMockList, homeworkMockList, homeworkStub };
