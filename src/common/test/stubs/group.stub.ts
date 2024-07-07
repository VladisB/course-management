import { facultyCSStub } from ".";
import { Group } from "@app/groups/entities/group.entity";
import { GroupViewModel } from "@app/groups/view-models";

let groupMockList: Group[] = [];

const groupStub = new Group();
groupStub.id = 1;
groupStub.name = "Test group";
groupStub.faculty = facultyCSStub;
groupStub.groupCourses = [];

groupMockList = [groupStub];

const groupVMStub = new GroupViewModel();
groupVMStub.id = 1;
groupVMStub.groupName = groupStub.name;
groupVMStub.facultyName = facultyCSStub.name;
groupVMStub.courses = [];

const groupVMMockList: GroupViewModel[] = [groupVMStub];

export { groupMockList, groupStub, groupVMStub, groupVMMockList };
