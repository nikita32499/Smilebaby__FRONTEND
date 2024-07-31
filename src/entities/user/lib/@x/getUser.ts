'use server';

import { SchemaUser } from 'shared_SmileBaby/dist/contract/user.contract';
import { IUser } from 'shared_SmileBaby/dist/types/user.types';

export const getUser = async (id: number): Promise<IUser | null> => {
    const response = await fetch(`${process.env['API_URL']}/user/getById/${id}`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        return null;
    }
    const user = await response.json();

    if (user === false) return null;

    return SchemaUser.parse(user);
};
