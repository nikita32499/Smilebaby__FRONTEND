'use client';

// import { login } from 'api/users.api';

import { Login } from './ui/Login/Login';

import { isNotBrowser } from 'shared/helpers/isNotBrowser';
import { Flex } from 'antd';
interface IStateLogin {
    errors: {
        message?: string;
    };
}

export const LoginPage = () => {
    if (isNotBrowser()) return;

    return (
        <Flex justify='center' align='center'>
            <Login />
        </Flex>
    );
};
