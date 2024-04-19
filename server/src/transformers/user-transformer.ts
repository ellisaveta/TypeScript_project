import { UserModel } from "../models/user-model";

export class UserTransformer {
    transform(user: UserModel) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    }

    transformArray(users: UserModel[]) {
        return users.map(user => this.transform(user));
    }
}