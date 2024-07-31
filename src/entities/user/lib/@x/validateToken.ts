'use server';

import { SchemaJwtUserData } from 'shared_SmileBaby/dist/contract/user.contract';
import { IJwtUserData } from 'shared_SmileBaby/dist/types/user.types';

export const validateToken = async (token: string): Promise<IJwtUserData | false> => {
    const response = await fetch(`${process.env['API_URL']}/auth/validateToken`, {
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
    const jwtData = await response.json();
    if (jwtData === false) return false;
    return SchemaJwtUserData.parse(jwtData);
};
