'use client';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Flex, Form, Input, Layout, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { useErrorHookForm } from 'shared/hook/useErrorHookForm';

import { useRouter } from 'next/navigation';
import { getErrorRTK } from 'shared/helpers/RTK-query';
import { useActions } from 'shared/hook/redux-hooks';

import { UserApi } from 'entities/user/';

const { Text } = Typography;

const { Content } = Layout;

const SchemaLoginForm = z.object({
    login: z.string().min(1, {
        message: 'Укажите логин',
    }),
    password: z.string().min(1, {
        message: 'Укажите пароль',
    }),
});

type TSchemaLoginForm = z.infer<typeof SchemaLoginForm>;

export const Login: FC = () => {
    const form = useForm<TSchemaLoginForm>({
        resolver: zodResolver(SchemaLoginForm),
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const { errorMessage, setStatus } = useErrorHookForm(form);

    const onSubmit = async (data: TSchemaLoginForm) => {
        const result = await login(data.login, data.password);

        setStatus(result);
    };
    const [UserLogin, {}] = UserApi.useLoginMutation();

    const { setProfile } = useActions();

    const router = useRouter();

    const login = async (login: string, password: string) => {
        const result = await UserLogin({
            login,
            password,
        });
        const { data: user, error } = result;
        if (!error) {
            setProfile(user);
            if (user.role === 'admin' || user.role === 'moderator') {
                router.push(`/panel/admin`);
                // window.location.assign(`/panel/admin`);
            } else {
                router.push(`/dashboard`);
                // window.location.assign(`/dashboard`);
            }
        }
        return result;
    };

    return (
        <Card style={{ maxWidth: '400px' }}>
            <Form
                onSubmitCapture={form.handleSubmit(onSubmit)}
                // style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Flex vertical align='center'>
                    <img height={50} width={50} src='/favicon.ico' alt='' />
                    <Title>{window.location.hostname}</Title>
                </Flex>
                <Form.Item
                    name='login'
                    label='Логин'
                    rules={[{ required: true, message: '' }]}
                >
                    <Controller
                        name='login'
                        control={form.control}
                        render={({ field }) => (
                            <Input {...field} placeholder='Придумайте логин' />
                        )}
                    />
                </Form.Item>
                <Form.Item
                    name='password'
                    label='Пароль'
                    rules={[{ required: true, message: '' }]}
                >
                    <Controller
                        name='password'
                        control={form.control}
                        render={({ field }) => (
                            <Input.Password {...field} placeholder='Придумайте логин' />
                        )}
                    />
                </Form.Item>
                <Text type='danger' style={{ opacity: `${errorMessage ? '1' : '0'}` }}>
                    {errorMessage ?? '!'}
                </Text>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
