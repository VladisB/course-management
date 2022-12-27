import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";

@ValidatorConstraint({ name: "isUserAlreadyExist", async: true })
@Injectable()
export class IsUserNotExist implements ValidatorConstraintInterface {
    constructor(protected readonly usersService: UsersService) {}

    async validate(text: string) {
        const user = await this.usersService.getUserByEmail(text);

        return !user;
    }
}

export function IsNotExistedUser(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsNotExistedUser",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUserNotExist,
        });
    };
}
