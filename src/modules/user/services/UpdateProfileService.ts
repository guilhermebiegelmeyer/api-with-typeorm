import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UserRepository from '../typeorm/repositories/UserRepository';
import { compare, hash } from 'bcryptjs';

interface iRequest {
    id_user: string;
    full_name: string;
    email: string;
    password?: string;
    old_password?: string;
}

class UpdateProfileService {
    public async execute({
        id_user,
        full_name,
        email,
        password,
        old_password,
    }: iRequest): Promise<User> {
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findById(id_user);

        if (!user) {
            throw new AppError('user not found');
        }

        const userUpdateEmail = await userRepository.findByEmail(email);

        if (userUpdateEmail && userUpdateEmail.id_user !== id_user) {
            throw new AppError('There is already one user with this email');
        }

        if (password && !old_password) {
            throw new AppError('Old password is required.');
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError('Old password does not match.');
            }

            user.password = await hash(password, 8);
        }

        user.full_name = full_name;
        user.email = email;

        await userRepository.save(user);

        return user;
    }
}

export default UpdateProfileService;
