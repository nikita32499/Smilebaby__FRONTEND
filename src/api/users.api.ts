import {
    IJwtUserData,
    isError,
    isJwtUserData,
    isUser,
    IUser,
    IUserCreate,
    IUserUpdate,
    NestError,
} from '@/types/user.types';
import axios, { AxiosError } from 'axios';

export async function login(
    login: string,
    password: string,
): Promise<NestError | IJwtUserData | false> {
    let data: unknown;
    try {
        let response = await axios.post(`${window.location.origin}/api/users/login`, {
            login,
            password,
        });

        data = response.data;
    } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
            data = error.response?.data;
        } else {
            return false;
        }
    }

    if (isJwtUserData(data)) {
        return data;
    } else if (isError(data)) {
        return data;
    }
    return false;
}

export async function getAllUsers(): Promise<IUser[]> {
    try {
        const response = await axios.get<IUser[]>(
            `${window.location.origin}/api/users/getAll`,
        );

        const users: IUser[] = response.data.filter((user) => isUser(user));

        return users;
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        throw error;
    }
}
export async function createUser(createData: IUserCreate): Promise<IUser> {
    try {
        const response = await axios.post<IUser>(
            `${window.location.origin}/api/users/create`,
            createData,
        );
        const user: IUser = response.data;
        if (!isUser(user)) throw new Error('Ошибка:невалидный пользователь');

        return user;
    } catch (error) {
        console.error('Ошибка при созданиии пользователей:', error);
        throw error;
    }
}

export async function updateUser(id: number, updateDate: IUserUpdate): Promise<IUser> {
    try {
        const response = await axios.post<IUser>(
            `${window.location.origin}/api/users/update`,
            updateDate,
        );
        const user: IUser = response.data;
        if (!isUser(user)) throw new Error('Ошибка:невалидный пользователь');

        return user;
    } catch (error) {
        console.error('Ошибка при обновлении пользователей:', error);
        throw error;
    }
}

export async function deleteUsers(id: number): Promise<IUser> {
    try {
        const response = await axios.delete<IUser>(
            `${window.location.origin}/api/users/delete`,
            {
                data: {
                    id,
                },
            },
        );
        const user: IUser = response.data;
        if (!isUser(user)) throw new Error('Ошибка:невалидный пользователь');

        return user;
    } catch (error) {
        console.error('Ошибка при удалении пользователей:', error);
        throw error;
    }
}
