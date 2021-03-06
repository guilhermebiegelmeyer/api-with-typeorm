import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';

class UserController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listUser = new ListUserService();

        const users = await listUser.execute();

        return response.json(classToClass(users));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { full_name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            full_name,
            email,
            password,
        });

        return response.json(classToClass(user));
    }
}

export default UserController;
