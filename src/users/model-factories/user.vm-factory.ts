import { User } from "../user.entity";
import { UserViewModel } from "../view-models";

export class UsersViewModelFactory implements IUsersViewModelFactory {
    public initUserViewModel(user: User): UserViewModel {
        const model: UserViewModel = {
            id: null,
            email: "",
            firstName: "",
            lastName: "",
            role: "",
        };

        return this.setUserViewModel(model, user);
    }

    public initUserListViewModel(users: User[]): UserViewModel[] {
        const model: UserViewModel[] = [];

        return this.setUserListViewModel(model, users);
    }

    private setUserViewModel(model: UserViewModel, user: User): UserViewModel {
        if (user) {
            model.id = user.id;
            model.email = user.email;
            model.firstName = user.firstName;
            model.lastName = user.lastName;
            model.role = user.role.name;
        }

        return model;
    }

    private setUserListViewModel(model: UserViewModel[], users: User[]): UserViewModel[] {
        if (users.length) {
            const userList = users.map<UserViewModel>((user) => ({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role.name,
            }));

            model.push(...userList);
        }

        return model;
    }
}

interface IUsersViewModelFactory {
    initUserViewModel(user: User): UserViewModel;
    initUserListViewModel(users: User[]): UserViewModel[];
}
