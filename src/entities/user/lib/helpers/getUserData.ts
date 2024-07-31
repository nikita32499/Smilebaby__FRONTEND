import Cookies from 'js-cookie';
import { SchemaJwtUserData } from 'shared_SmileBaby/dist/contract/user.contract';
import { IJwtUserData } from 'shared_SmileBaby/dist/types/user.types';

export const getUserData = (): IJwtUserData | null => {
    const token = Cookies.get('authorization');
    if (!token) return null;

    const userData = token.split('.')?.[1];
    if (!userData) return null;

    return SchemaJwtUserData.parse(JSON.parse(atob(userData)));
};
