import {
    IJwtUserData,
    IUser,
    IUserCreate,
    IUserJwtData,
    IUserUpdate,
} from '@/types/user.types';
import { appAxios } from './axios';

export async function login(login: string, password: string): Promise<IUserJwtData> {
    const response = await appAxios.post<IJwtUserData>(`/users/login`, {
        login,
        password,
    });
    return response.data;
}

export async function getAllUsers(): Promise<IUser[]> {
    const response = await appAxios.get<IUser[]>(
        `${window.location.origin}/api/users/getAll`,
    );
    return response.data;
}
export async function createUser(createData: IUserCreate): Promise<IUser> {
    const response = await appAxios.post<IUser>(
        `${window.location.origin}/api/users/create`,
        createData,
    );
    return response.data;
}

export async function updateUser(id: number, updateDate: IUserUpdate): Promise<IUser> {
    const response = await appAxios.post<IUser>(
        `${window.location.origin}/api/users/update`,
        updateDate,
    );
    return response.data;
}

export async function deleteUsers(id: number): Promise<IUser> {
    const response = await appAxios.delete<IUser>(
        `${window.location.origin}/api/users/delete`,
        {
            data: {
                id,
            },
        },
    );
    return response.data;
}
