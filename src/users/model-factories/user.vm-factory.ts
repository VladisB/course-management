import { User } from "../user.entity";
import { UserViewModel } from "../view-models";

export class UserViewModelFactory implements IUserViewModelFactory {
    public initUserViewModel(user: User): UserViewModel {
        const model: UserViewModel = {
            id: null,
            email: "",
            firstName: "",
            lastName: "",
            role: "",
        };
        return this.setUserDisplayFormViewModel(model, user);
    }

    private setUserDisplayFormViewModel(model: UserViewModel, user: User): UserViewModel {
        if (user) {
            model.id = user.id;
            model.email = user.email;
            model.firstName = user.firstName;
            model.lastName = user.lastName;
            model.role = user.role.name;
        }

        return model;
    }
}

interface IUserViewModelFactory {
    initUserViewModel(user: User): UserViewModel;
}
