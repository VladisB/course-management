import { User } from "src/users/entities/user.entity";
import { JwtModel } from "../models";

export class JwtModelFactory implements IJwtModelFactory {
    public initJwtModel(user: User): JwtModel {
        const model: JwtModel = {
            id: null,
            email: "",
            role: "",
        };
        return this.setJwtModel(model, user);
    }

    private setJwtModel(model: JwtModel, user: User): JwtModel {
        if (user) {
            model.id = user.id;
            model.email = user.email;
            model.role = user.role.name;
        }

        return model;
    }
}

interface IJwtModelFactory {
    initJwtModel(user: User): JwtModel;
}
