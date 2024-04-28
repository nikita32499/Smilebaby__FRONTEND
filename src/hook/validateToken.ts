'use server';

import { IJwtUserData } from '@/types/user.types';

export const validateToken = async (token: string): Promise<IJwtUserData | false> => {
    const response = await fetch(`${process.env.API_URL}/users/validateToken`, {
        cache: 'no-store',
        method: 'POST',
        body: JSON.stringify({
            token,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        return false;
    }
    return await response.json();
};
