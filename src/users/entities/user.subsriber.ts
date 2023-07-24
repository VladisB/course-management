import { DataSource, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    async beforeUpdate(event: UpdateEvent<User>) {
        const updatedUser: User = event.entity as User;
        const databaseUser: User | undefined = event.databaseEntity;

        if (updatedUser.password !== undefined && updatedUser.password === "") {
            const isPasswordEquals =
                databaseUser && (await databaseUser.validateRawPassword(updatedUser.password));

            if (databaseUser && isPasswordEquals === false) {
                updatedUser.salt = await bcrypt.genSalt();
                updatedUser.password = await bcrypt.hash(updatedUser.password, updatedUser.salt);
            }
        }

        if (updatedUser.email) {
            updatedUser.email = updatedUser.email.toLowerCase();
        }
    }
}
