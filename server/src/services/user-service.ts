import { UserModel } from '../models/user-model';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UniqueViolationError } from 'objection';
import { EmailAlreadyExistsError } from '../errors';

export const RegistrationInputSchema = z.object({
    name: z.string().min(2, 'Name should have atleast 2 alphabets')
        .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value), 'Name should contain only alphabets')
        .refine((value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value), 'Please enter both firstname and lastname'),
    email: z.string().min(5).email('Email must be valid!'),
    password: z.string().min(8)
});
type RegistrationInput = z.infer<typeof RegistrationInputSchema>;

export const ModifyUserInputSchema = z.object({
    name: z.string().min(2, 'Name should have atleast 2 alphabets')
        .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value), 'Name should contain only alphabets')
        .refine((value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value), 'Please enter both firstname and lastname').optional(),
    password: z.string().min(8).optional()
});
type ModifyUserInput = z.infer<typeof ModifyUserInputSchema>;

const SALT_ROUNDS = 10;

export class UserService {
    async register(data: RegistrationInput) {
        const hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        try {
            return await UserModel.query().insertAndFetch({ name: data.name, email: data.email, password: hashPassword });;
        } catch (err) {
            if (err instanceof UniqueViolationError && err.constraint === 'users_email_unique') {
                throw new EmailAlreadyExistsError('This email is already used!');
            }
            throw err;
        }
    }

    async login(email: string, password: string) {
        const user = await UserModel.query().findOne({ email });
        if (!user) {
            return undefined;
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return undefined;
        }

        return user;
    }

    async getUserById(id: number) {
        return await UserModel.query().findById(id);
    }

    async update(id: number, data: ModifyUserInput) {
        let hashPassword = data?.password;
        if (data.password !== undefined) {
            hashPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        }
        const user = await UserModel.query().findById(id);
        return await user?.$query().patchAndFetch({ name: data?.name, password: hashPassword });
    }

    async deleteById(id: number) {
        return await UserModel.query().deleteById(id);
    }
}