'use client';

import { IUserCreateData, UserRole } from 'shared_SmileBaby/dist/types/user.types';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Select, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { UserApi } from 'entities/user';
import { Controller, useForm } from 'react-hook-form';
import { useErrorHookForm } from 'shared/hook/useErrorHookForm';
import { SchemaUserCreate } from 'shared_SmileBaby/dist/contract/user.contract';

const { Option } = Select;

interface IPropsCreateUser {
    flow: {
        goBack: () => void;
    };
}

export const CreateUser: FC<IPropsCreateUser> = (props) => {
    const { flow } = props;
    const [createUser] = UserApi.useCreateMutation();
    const form = useForm<IUserCreateData>({
        resolver: zodResolver(SchemaUserCreate),
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const { errorMessage, setStatus } = useErrorHookForm(form);

    const onSubmit = async (createData: IUserCreateData) => {
        const result = await createUser({ createData });
        const { success } = setStatus(result);
        if (success) {
            flow.goBack();
        }
    };

    const errors = form.formState.errors;

    return (
        <Form onSubmitCapture={form.handleSubmit(onSubmit)}>
            <Title>Создание пользователя</Title>
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
                        <Input.Password {...field} placeholder='Придумайте пароль' />
                    )}
                />
            </Form.Item>
            <Form.Item
                name='role'
                label='Права'
                rules={[{ required: true, message: '' }]}
            >
                <Controller
                    name='role'
                    control={form.control}
                    render={({ field }) => (
                        <Select {...field} placeholder='Выберите права'>
                            <Option key={''} value={''}>
                                {'Выберите права'}
                            </Option>
                            {Object.values(UserRole)
                                .filter((role) => role !== 'admin' && role !== 'user')
                                .map((role, index) => (
                                    <Option key={index} value={role}>
                                        {role}
                                    </Option>
                                ))}
                        </Select>
                    )}
                />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type='primary' htmlType='submit'>
                        Создать
                    </Button>
                    <Button onClick={flow.goBack}>Назад</Button>
                </Space>
            </Form.Item>
            <Typography.Text
                type='danger'
                style={{ opacity: `${errorMessage ? '1' : '0'}` }}
            >
                {errorMessage ?? '!'}
            </Typography.Text>
        </Form>
    );
};
